import { NextRequest, NextResponse } from 'next/server';
import { withCors } from './cors';

/**
 * Simple in-memory rate limiter
 * In production, consider using Redis or a dedicated rate limiting service
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(windowMs: number = 60000, maxRequests: number = 10) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  /**
   * Checks if a request should be allowed
   * @param identifier - Unique identifier (IP address, API key, etc.)
   * @returns true if request is allowed, false if rate limit exceeded
   */
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];

    // Remove requests outside the time window
    const validRequests = requests.filter((timestamp) => now - timestamp < this.windowMs);

    if (validRequests.length >= this.maxRequests) {
      return false;
    }

    // Add current request
    validRequests.push(now);
    this.requests.set(identifier, validRequests);

    return true;
  }

  /**
   * Gets the number of remaining requests
   */
  getRemaining(identifier: string): number {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    const validRequests = requests.filter((timestamp) => now - timestamp < this.windowMs);
    return Math.max(0, this.maxRequests - validRequests.length);
  }

  /**
   * Gets the time until rate limit resets (in seconds)
   */
  getResetTime(identifier: string): number {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    const validRequests = requests.filter((timestamp) => now - timestamp < this.windowMs);

    if (validRequests.length === 0) {
      return 0;
    }

    const oldestRequest = Math.min(...validRequests);
    const resetTime = oldestRequest + this.windowMs;
    return Math.max(0, Math.ceil((resetTime - now) / 1000));
  }

  /**
   * Cleans up old entries (call periodically to prevent memory leaks)
   */
  cleanup(): void {
    const now = Date.now();
    for (const [identifier, requests] of this.requests.entries()) {
      const validRequests = requests.filter((timestamp) => now - timestamp < this.windowMs);
      if (validRequests.length === 0) {
        this.requests.delete(identifier);
      } else {
        this.requests.set(identifier, validRequests);
      }
    }
  }
}

// Create rate limiter instances
// Default: 10 requests per minute per identifier
const defaultLimiter = new RateLimiter(60000, 10);

// Stricter limiter for unauthenticated requests: 5 requests per minute
const unauthenticatedLimiter = new RateLimiter(60000, 5);

// Cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    defaultLimiter.cleanup();
    unauthenticatedLimiter.cleanup();
  }, 5 * 60 * 1000);
}

/**
 * Gets identifier for rate limiting
 * Uses API key if available, otherwise falls back to IP address
 */
function getRateLimitIdentifier(req: NextRequest): string {
  // Try to get API key first
  const apiKey = req.headers.get('X-API-Key') || req.headers.get('x-api-key');
  const authHeader = req.headers.get('Authorization');

  if (apiKey) {
    return `api_key:${apiKey}`;
  }

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    return `api_key:${token}`;
  }

  // Fall back to IP address
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : req.headers.get('x-real-ip') || 'unknown';

  return `ip:${ip}`;
}

/**
 * Gets rate limit headers for a request
 */
export function getRateLimitHeaders(req: NextRequest): Record<string, string> {
  const identifier = getRateLimitIdentifier(req);
  const hasApiKey = process.env.API_KEY && validateApiKey(req).valid;
  const limiter = hasApiKey ? defaultLimiter : unauthenticatedLimiter;

  const limit = hasApiKey ? 10 : 5;
  const remaining = limiter.getRemaining(identifier);
  const resetTime = limiter.getResetTime(identifier);

  return {
    'X-RateLimit-Limit': String(limit),
    'X-RateLimit-Remaining': String(remaining),
    'X-RateLimit-Reset': String(Math.floor(Date.now() / 1000) + resetTime),
  };
}

/**
 * Checks rate limit and returns error response if exceeded
 */
export function checkRateLimit(req: NextRequest): NextResponse | null {
  const identifier = getRateLimitIdentifier(req);
  const hasApiKey = process.env.API_KEY && validateApiKey(req).valid;

  // Use stricter limits for unauthenticated requests
  const limiter = hasApiKey ? defaultLimiter : unauthenticatedLimiter;

  if (!limiter.isAllowed(identifier)) {
    const headers = getRateLimitHeaders(req);
    const resetTime = limiter.getResetTime(identifier);

    return withCors(
      NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: 'Too many requests. Please try again later.',
          retryAfter: resetTime,
        },
        {
          status: 429,
          headers: {
            ...headers,
            'Retry-After': String(resetTime),
          },
        },
      ),
    );
  }

  return null;
}

/**
 * Validates API key (simple check for rate limiting logic)
 */
function validateApiKey(req: NextRequest): { valid: boolean } {
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    return { valid: false };
  }

  const headerKey = req.headers.get('X-API-Key') || req.headers.get('x-api-key');
  const authHeader = req.headers.get('Authorization');

  if (headerKey && headerKey === apiKey) {
    return { valid: true };
  }

  if (authHeader?.startsWith('Bearer ') && authHeader.substring(7) === apiKey) {
    return { valid: true };
  }

  return { valid: false };
}
