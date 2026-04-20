import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB default
  allowedMimeTypes: (process.env.ALLOWED_MIME_TYPES || 'text/plain').split(','),
  maxBodySize: process.env.MAX_BODY_SIZE || '10mb',
  staticPath: process.env.STATIC_PATH || path.join(__dirname, '../frontend/dist'),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  logLevel: process.env.LOG_LEVEL || 'info',
};