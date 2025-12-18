import { NextRequest, NextResponse } from 'next/server';
import { withCors } from './cors';

/**
 * Validates API key from request headers
 * Checks for X-API-Key header or Authorization header with Bearer token
 */
export function validateApiKey(req: NextRequest): { valid: boolean; error?: string } {
  const apiKey = process.env.API_KEY;

  // If no API key is set in env, allow all requests (development mode)
  if (!apiKey || apiKey.trim() === '') {
    return { valid: true };
  }

  // Try to get API key from headers
  const headerKey = req.headers.get('X-API-Key') || req.headers.get('x-api-key');
  const authHeader = req.headers.get('Authorization');

  let providedKey: string | null = null;

  if (headerKey) {
    providedKey = headerKey;
  } else if (authHeader?.startsWith('Bearer ')) {
    providedKey = authHeader.substring(7);
  }

  if (!providedKey) {
    return {
      valid: false,
      error: 'API key is required. Provide it in X-API-Key header or Authorization: Bearer <token>',
    };
  }

  if (providedKey !== apiKey) {
    return {
      valid: false,
      error: 'Invalid API key',
    };
  }

  return { valid: true };
}

/**
 * Middleware function to check API key and return error response if invalid
 */
export function requireApiKey(req: NextRequest): NextResponse | null {
  const validation = validateApiKey(req);

  if (!validation.valid) {
    return withCors(NextResponse.json({ error: validation.error }, { status: 401 }));
  }

  return null;
}
