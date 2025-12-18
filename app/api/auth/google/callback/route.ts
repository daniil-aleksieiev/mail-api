import { NextRequest, NextResponse } from 'next/server';
import { withCors } from '@/src/lib/cors';

/**
 * GET /api/auth/google/callback
 * Handles callback from Google OAuth and exchanges code for refresh token
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

  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return withCors(NextResponse.json({ error: `OAuth error: ${error}` }, { status: 400 }));
  }

  if (!code) {
    return withCors(
      NextResponse.json({ error: 'Authorization code not provided' }, { status: 400 }),
    );
  }

  // Use redirect_uri from env or generate automatically
  const redirectUri = process.env.GMAIL_REDIRECT_URI || `${req.nextUrl.origin}/api/auth/google/callback`;

  try {
    // Exchange code for access token and refresh token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: GMAIL_API_KEY,
        client_secret: GMAIL_SECRET,
        code: code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      let errorMessage = 'Token exchange failed';
      try {
        const errorData = await tokenResponse.json();
        errorMessage = `Token exchange failed: ${errorData.error || 'unknown error'}`;

        if (errorData.error === 'invalid_grant') {
          errorMessage += '. The authorization code may have expired or already been used.';
        } else if (errorData.error === 'redirect_uri_mismatch') {
          errorMessage += `. Redirect URI mismatch. Expected: ${redirectUri}. Make sure this URI is added to your Google Cloud Console OAuth 2.0 Client ID settings.`;
        }

        if (errorData.error_description) {
          errorMessage += ` (${errorData.error_description})`;
        }
      } catch {
        const errorText = await tokenResponse.text();
        errorMessage = `Token exchange failed: ${errorText}`;
      }

      return withCors(
        NextResponse.json(
          {
            error: errorMessage,
            redirect_uri_used: redirectUri,
            hint: 'Make sure the redirect URI in Google Cloud Console matches exactly: ' + redirectUri,
          },
          { status: 400 },
        ),
      );
    }

    const tokens = await tokenResponse.json();

    if (!tokens.refresh_token) {
      return withCors(
        NextResponse.json(
          {
            error: 'Refresh token not received. This may happen if you already authorized the app. Try revoking access and authorizing again.',
            access_token: tokens.access_token,
            hint: 'Make sure to include "prompt=consent" in the authorization URL to force refresh token generation',
          },
          { status: 400 },
        ),
      );
    }

    // Return refresh token (save it to .env as GMAIL_REFRESH_TOKEN)
    return withCors(
      NextResponse.json({
        success: true,
        refresh_token: tokens.refresh_token,
        access_token: tokens.access_token, // Temporary, usually lives for 1 hour
        expires_in: tokens.expires_in,
        message: 'Save the refresh_token to your .env file as GMAIL_REFRESH_TOKEN',
        redirect_uri_used: redirectUri,
      }),
    );
  } catch (error) {
    return withCors(
      NextResponse.json(
        { error: `Failed to exchange token: ${error instanceof Error ? error.message : 'Unknown error'}` },
        { status: 500 },
      ),
    );
  }
}
