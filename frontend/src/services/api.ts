export async function apiFetch<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  const contentType = typeof response.headers?.get === 'function'
    ? response.headers.get('content-type') ?? ''
    : '';

  const body = contentType.includes('application/json') && typeof response.json === 'function'
    ? await response.json()
    : typeof response.text === 'function'
      ? await response.text()
      : typeof response.json === 'function'
        ? await response.json()
        : null;

  if (!response.ok) {
    const message = typeof body === 'object' && body !== null && 'error' in body
      ? (body as { error: string }).error
      : String(body || `${response.status} ${response.statusText}`);

    throw new Error(message);
  }

  return body as T;
}
