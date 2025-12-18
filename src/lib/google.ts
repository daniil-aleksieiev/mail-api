export type GmailConfig = {
  gmail_api_refresh_token: string;
  gmail_api_sender_email: string;
  gmail_api_sender_name: string;
};

export type SendEmailParams = {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  cc?: string | string[];
  bcc?: string | string[];
};

const GMAIL_API_KEY = process.env.GMAIL_API_KEY;
const GMAIL_SECRET = process.env.GMAIL_SECRET;

export const getAccessToken = async (refreshToken: string): Promise<string> => {
  if (!GMAIL_API_KEY || !GMAIL_SECRET) {
    throw new Error('Google API keys not found');
  }

  if (!refreshToken || refreshToken.trim() === '') {
    throw new Error('Refresh token is empty or not provided');
  }

  const body = new URLSearchParams({
    client_id: GMAIL_API_KEY,
    client_secret: GMAIL_SECRET,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  });

  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!r.ok) {
    let errorMessage = 'Token exchange failed';
    try {
      const errorData = await r.json();
      errorMessage = `Token exchange failed: ${errorData.error || 'unknown error'}`;

      // Add more descriptive messages for common errors
      if (errorData.error === 'invalid_grant') {
        errorMessage +=
          '. This usually means: 1) Refresh token is invalid/expired, 2) Token was revoked, 3) Token belongs to different client ID, or 4) Redirect URI mismatch. Please get a new refresh token via /api/auth/google';
      } else if (errorData.error === 'invalid_client') {
        errorMessage += '. Check that GMAIL_API_KEY and GMAIL_SECRET are correct';
      }

      if (errorData.error_description) {
        errorMessage += ` (${errorData.error_description})`;
      }
    } catch {
      const errorText = await r.text();
      errorMessage = `Token exchange failed: ${errorText}`;
    }

    throw new Error(errorMessage);
  }

  const json = await r.json();

  if (!json.access_token) {
    throw new Error('Access token not received in response');
  }

  return json.access_token as string;
};

/**
 * Creates MIME message for sending via Gmail API
 */
function createMimeMessage(params: SendEmailParams, fromEmail: string, fromName: string): string {
  const to = Array.isArray(params.to) ? params.to.join(', ') : params.to;
  const cc = params.cc ? (Array.isArray(params.cc) ? params.cc.join(', ') : params.cc) : '';
  const bcc = params.bcc ? (Array.isArray(params.bcc) ? params.bcc.join(', ') : params.bcc) : '';

  const boundary = `----=_Part_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  const from = fromName ? `${fromName} <${fromEmail}>` : fromEmail;

  let message = `From: ${from}\r\n`;
  message += `To: ${to}\r\n`;
  if (cc) message += `Cc: ${cc}\r\n`;
  if (bcc) message += `Bcc: ${bcc}\r\n`;
  message += `Subject: ${params.subject}\r\n`;
  message += `MIME-Version: 1.0\r\n`;
  message += `Content-Type: multipart/alternative; boundary="${boundary}"\r\n\r\n`;

  // Text part
  if (params.text) {
    message += `--${boundary}\r\n`;
    message += `Content-Type: text/plain; charset=UTF-8\r\n`;
    message += `Content-Transfer-Encoding: 7bit\r\n\r\n`;
    message += `${params.text}\r\n\r\n`;
  }

  // HTML part
  if (params.html) {
    message += `--${boundary}\r\n`;
    message += `Content-Type: text/html; charset=UTF-8\r\n`;
    message += `Content-Transfer-Encoding: 7bit\r\n\r\n`;
    message += `${params.html}\r\n\r\n`;
  }

  message += `--${boundary}--`;

  return message;
}

/**
 * Encodes MIME message to base64url format for Gmail API
 */
function encodeMessage(message: string): string {
  return Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Sends email via Gmail API
 */
export async function sendEmail(
  params: SendEmailParams,
  config: GmailConfig,
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Get access token using refresh token
    const accessToken = await getAccessToken(config.gmail_api_refresh_token);

    // Create MIME message
    const mimeMessage = createMimeMessage(params, config.gmail_api_sender_email, config.gmail_api_sender_name);
    const encodedMessage = encodeMessage(mimeMessage);

    // Send via Gmail API
    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        raw: encodedMessage,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Gmail API error: ${response.status} ${errorData}`);
    }

    const result = await response.json();

    return {
      success: true,
      messageId: result.id,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
