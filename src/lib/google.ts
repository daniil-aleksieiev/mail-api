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
  replyTo?: string | string[];
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
      // Don't expose raw error text to prevent information leakage
      errorMessage = 'Token exchange failed: Unable to parse error response';
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
/**
 * Gmail API has a limit of 25MB per message (including attachments)
 * We'll validate the message size before encoding
 */
const MAX_MESSAGE_SIZE = 25 * 1024 * 1024; // 25MB in bytes

function createMimeMessage(params: SendEmailParams, fromEmail: string, fromName: string): string {
  const to = Array.isArray(params.to) ? params.to.join(', ') : params.to;
  const cc = params.cc ? (Array.isArray(params.cc) ? params.cc.join(', ') : params.cc) : '';
  const bcc = params.bcc ? (Array.isArray(params.bcc) ? params.bcc.join(', ') : params.bcc) : '';
  const replyTo = params.replyTo ? (Array.isArray(params.replyTo) ? params.replyTo.join(', ') : params.replyTo) : '';

  const boundary = `----=_Part_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  const from = fromName ? `${fromName} <${fromEmail}>` : fromEmail;

  let message = `From: ${from}\r\n`;
  message += `To: ${to}\r\n`;
  if (cc) message += `Cc: ${cc}\r\n`;
  if (bcc) message += `Bcc: ${bcc}\r\n`;
  if (replyTo) message += `Reply-To: ${replyTo}\r\n`;
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
 * Validates message size before sending
 */
function validateMessageSize(message: string): { valid: boolean; error?: string } {
  // Base64 encoding increases size by ~33%, so we check the raw message
  const messageSize = Buffer.byteLength(message, 'utf8');

  if (messageSize > MAX_MESSAGE_SIZE) {
    return {
      valid: false,
      error: `Message size (${(messageSize / 1024 / 1024).toFixed(2)}MB) exceeds Gmail API limit of 25MB`,
    };
  }

  return { valid: true };
}

/**
 * Parses Gmail API error response for better error messages
 */
function parseGmailError(status: number, errorText: string): string {
  try {
    const errorData = JSON.parse(errorText);
    const error = errorData.error || {};

    // Common Gmail API errors
    switch (status) {
      case 400:
        if (error.message?.includes('Invalid')) {
          return 'Invalid request: Please check your email parameters';
        }
        if (error.message?.includes('size')) {
          return 'Message too large: Email exceeds Gmail API size limit';
        }
        return 'Bad request: Invalid email parameters';

      case 401:
        return 'Authentication failed. Check your refresh token.';

      case 403:
        if (error.message?.includes('quota')) {
          return 'Gmail API quota exceeded. Daily limit reached.';
        }
        if (error.message?.includes('permission')) {
          return 'Permission denied. Check OAuth scopes.';
        }
        return 'Access forbidden: Check OAuth permissions and API quotas';

      case 429:
        return 'Rate limit exceeded. Too many requests to Gmail API.';

      case 500:
      case 503:
        return 'Gmail API service temporarily unavailable. Please try again later.';

      default:
        return `Gmail API error (${status}): Please try again later`;
    }
  } catch {
    // Don't expose raw error text to prevent information leakage
    return `Gmail API error (${status}): Unable to parse error response`;
  }
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

    // Validate message size
    const sizeValidation = validateMessageSize(mimeMessage);
    if (!sizeValidation.valid) {
      return {
        success: false,
        error: sizeValidation.error,
      };
    }

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
      const errorText = await response.text();
      const errorMessage = parseGmailError(response.status, errorText);
      throw new Error(errorMessage);
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
