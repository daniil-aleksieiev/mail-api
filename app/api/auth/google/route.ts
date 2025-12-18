import { NextRequest, NextResponse } from 'next/server';
import { withCors } from '@/src/lib/cors';

/**
 * GET /api/auth/google
 * Initiates OAuth flow - redirects to Google for authorization
 */
export async function GET(req: NextRequest) {
  const GMAIL_API_KEY = process.env.GMAIL_API_KEY;
  const GMAIL_SECRET = process.env.GMAIL_SECRET;

  if (!GMAIL_API_KEY || !GMAIL_SECRET) {
    return withCors(
      NextResponse.json(
        { error: 'GMAIL_API_KEY and GMAIL_SECRET must be set in environment variables' },
        { status: 500 },
      ),
    );
  }

  // Get redirect_uri from env, query params, or use current domain
  const searchParams = req.nextUrl.searchParams;
  const redirectUri = process.env.GMAIL_REDIRECT_URI || searchParams.get('redirect_uri') || `${req.nextUrl.origin}/api/auth/google/callback`;

  // Parameters for OAuth request
  const params = new URLSearchParams({
    client_id: GMAIL_API_KEY,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/gmail.send',
    access_type: 'offline',
    prompt: 'consent', // Important: without this we won't get refresh_token
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  return NextResponse.redirect(authUrl);
}
