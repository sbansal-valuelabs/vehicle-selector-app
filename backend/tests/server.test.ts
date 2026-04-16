import request from 'supertest';
import app from '../server';

describe('Vehicle Selector Form Server API', () => {
    // Requires a production frontend build (`npm run build --workspace=frontend`) to pass.
    // The static middleware serves files from frontend/dist which must exist first.

    it('should handle form submission with a logbook file on POST /upload', async () => {
        const fileContent = 'Service completed at 10,000 miles.\nOil change and tire rotation.';

        const response = await request(app)
            .post('/upload')
            .field('make', 'Toyota')
            .field('model', 'Corolla')
            .field('badge', 'LE')
            .attach('logbook', Buffer.from(fileContent), 'logbook.txt');

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/application\/json/);
        expect(response.body.make).toBe('Toyota');
        expect(response.body.model).toBe('Corolla');
        expect(response.body.badge).toBe('LE');
        expect(response.body.logbookContent).toBe(fileContent);
    });

    it('should handle form submission without a logbook file gracefully', async () => {
        const response = await request(app)
            .post('/upload')
            .field('make', 'Ford')
            .field('model', 'Mustang')
            .field('badge', 'GT');

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/application\/json/);
        expect(response.body.make).toBe('Ford');
        expect(response.body.model).toBe('Mustang');
        expect(response.body.badge).toBe('GT');
        expect(response.body.logbookContent).toBe('No file uploaded.');
    });

    it('should return vehicle data on GET /vehicles', async () => {
        const response = await request(app).get('/vehicles');

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/application\/json/);
        expect(response.body).toHaveProperty('Ford');
        expect(response.body).toHaveProperty('BMW');
        expect(response.body).toHaveProperty('Tesla');
        expect(response.body.Ford).toHaveProperty('Ranger');
        expect(response.body.Tesla).toHaveProperty('Model 3');
    });

    it('should return 400 when required fields are missing', async () => {
        const response = await request(app)
            .post('/upload')
            .field('make', 'Honda');

        expect(response.status).toBe(400);
        expect(response.headers['content-type']).toMatch(/application\/json/);
        expect(response.body.error).toBe('Model is required. Badge is required.');
    });

    it('should reject non-plain-text file uploads', async () => {
        const response = await request(app)
            .post('/upload')
            .field('make', 'Tesla')
            .field('model', 'Model 3')
            .field('badge', 'Performance')
            .attach('logbook', Buffer.from('not a text file'), { filename: 'logbook.jpg', contentType: 'image/jpeg' });

        expect(response.status).toBe(400);
        expect(response.headers['content-type']).toMatch(/application\/json/);
        expect(response.body.error).toBe('Only plain text logbooks are accepted.');
    });
});