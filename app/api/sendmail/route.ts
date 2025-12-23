import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, type SendEmailParams, type GmailConfig, type Attachment } from '@/src/lib/google';
import { withCors } from '@/src/lib/cors';
import { parseEmailContent } from '@/src/lib/email-parser';
import { requireApiKey } from '@/src/lib/auth';
import { checkRateLimit, getRateLimitHeaders } from '@/src/lib/rate-limit';
import { validateEmailAddresses } from '@/src/lib/email-validator';
import { validateAttachments } from '@/src/lib/attachment-validator';
import { loadAttachmentFromUrl } from '@/src/lib/attachment-loader';

/**
 * POST /api/sendmail
 * Sends email via Gmail API
 *
 * Body can be:
 * 1. JSON with fields: to, subject, html/text/fields, cc, bcc, senderEmail, senderName, refreshToken
 * 2. JSON with template and data for substitution
 * 3. Fields can be: string (text/HTML), object (auto-formatted), or explicit html/text
 *
 * Security:
 * - Requires API key in X-API-Key header or Authorization: Bearer <token> (if API_KEY env is set)
 * - Rate limiting: 10 requests/minute with API key, 5 requests/minute without
 */
export async function POST(req: NextRequest) {
  // Check rate limit first
  const rateLimitError = checkRateLimit(req);
  if (rateLimitError) {
    return rateLimitError;
  }

  // Check API key (if API_KEY is set in env)
  const authError = requireApiKey(req);
  if (authError) {
    return authError;
  }

  try {
    const body = await req.json();

    // Validate required fields
    if (!body.to) {
      return withCors(NextResponse.json({ error: 'Field "to" is required' }, { status: 400 }));
    }

    if (!body.subject) {
      return withCors(NextResponse.json({ error: 'Field "subject" is required' }, { status: 400 }));
    }

    // Validate email addresses
    const toValidation = validateEmailAddresses(body.to);
    if (!toValidation.valid) {
      return withCors(
        NextResponse.json(
          { error: 'Invalid email addresses in "to" field', invalid: toValidation.invalid },
          { status: 400 },
        ),
      );
    }

    if (body.cc) {
      const ccValidation = validateEmailAddresses(body.cc);
      if (!ccValidation.valid) {
        return withCors(
          NextResponse.json(
            { error: 'Invalid email addresses in "cc" field', invalid: ccValidation.invalid },
            { status: 400 },
          ),
        );
      }
    }

    if (body.bcc) {
      const bccValidation = validateEmailAddresses(body.bcc);
      if (!bccValidation.valid) {
        return withCors(
          NextResponse.json(
            { error: 'Invalid email addresses in "bcc" field', invalid: bccValidation.invalid },
            { status: 400 },
          ),
        );
      }
    }

    if (body.replyTo) {
      const replyToValidation = validateEmailAddresses(body.replyTo);
      if (!replyToValidation.valid) {
        return withCors(
          NextResponse.json(
            { error: 'Invalid email addresses in "replyTo" field', invalid: replyToValidation.invalid },
            { status: 400 },
          ),
        );
      }
    }

    // Get configuration from body or env
    const refreshToken = body.refreshToken || process.env.GMAIL_REFRESH_TOKEN;
    const senderEmail = body.senderEmail || process.env.GMAIL_SENDER_EMAIL;
    const senderName = body.senderName || process.env.GMAIL_SENDER_NAME;

    if (!refreshToken) {
      return withCors(
        NextResponse.json(
          { error: 'refreshToken is required (provide in body or set GMAIL_REFRESH_TOKEN in env)' },
          { status: 400 },
        ),
      );
    }

    if (!senderEmail) {
      return withCors(
        NextResponse.json(
          { error: 'senderEmail is required (provide in body or set GMAIL_SENDER_EMAIL in env)' },
          { status: 400 },
        ),
      );
    }

    // Parse email content - supports text, object, or HTML
    let html: string | undefined;
    let text: string | undefined;

    // If explicit html or text is provided, use them
    if (body.html !== undefined) {
      const parsed = parseEmailContent(body.html);
      html = parsed.html;
      text = parsed.text;
    } else if (body.text !== undefined) {
      const parsed = parseEmailContent(body.text);
      html = parsed.html;
      text = parsed.text;
    } else if (body.fields !== undefined) {
      // If fields object is provided, parse it
      const parsed = parseEmailContent(body.fields);
      html = parsed.html;
      text = parsed.text;
    } else if (body.template && body.data) {
      // Handle template with data substitution
      const template = body.template;
      const data = body.data;

      // Simple substitution: replace {{key}} with value from data
      const processTemplate = (templateStr: string): string => {
        let result = templateStr;
        for (const [key, value] of Object.entries(data)) {
          const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
          result = result.replace(regex, String(value));
        }
        return result;
      };

      if (typeof template === 'string') {
        html = processTemplate(template);
      } else if (template.html) {
        html = processTemplate(template.html);
      }
      if (template?.text) {
        text = processTemplate(template.text);
      }
    } else {
      return withCors(
        NextResponse.json(
          { error: 'Either "html", "text", "fields", or "template" field is required' },
          { status: 400 },
        ),
      );
    }

    // Process attachments if provided
    let attachments: Attachment[] | undefined;
    if (body.attachments && Array.isArray(body.attachments)) {
      // Validate attachments first
      const validation = validateAttachments(body.attachments);
      if (!validation.valid) {
        return withCors(
          NextResponse.json(
            {
              error: validation.error || 'Invalid attachments',
              invalidAttachments: validation.invalid,
            },
            { status: 400 },
          ),
        );
      }

      // Load attachments from URLs if needed
      attachments = [];
      for (const attachment of body.attachments) {
        if (attachment.url) {
          try {
            const loaded = await loadAttachmentFromUrl(attachment.url);
            attachments.push({
              filename: attachment.filename,
              content: loaded.content,
              contentType: attachment.contentType || loaded.contentType || 'application/octet-stream',
            });
          } catch (error) {
            return withCors(
              NextResponse.json(
                {
                  error: `Failed to load attachment "${attachment.filename}" from URL: ${
                    error instanceof Error ? error.message : 'Unknown error'
                  }`,
                },
                { status: 400 },
              ),
            );
          }
        } else if (attachment.content) {
          // Use provided base64 content
          attachments.push({
            filename: attachment.filename,
            content: attachment.content,
            contentType: attachment.contentType || 'application/octet-stream',
          });
        } else {
          return withCors(
            NextResponse.json(
              { error: `Attachment "${attachment.filename}" must have either "content" or "url" field` },
              { status: 400 },
            ),
          );
        }
      }
    }

    // Prepare parameters for sending
    const emailParams: SendEmailParams = {
      to: body.to,
      subject: body.subject,
      html: html,
      text: text,
      cc: body.cc,
      bcc: body.bcc,
      replyTo: body.replyTo,
      attachments: attachments,
    };

    const config: GmailConfig = {
      gmail_api_refresh_token: refreshToken,
      gmail_api_sender_email: senderEmail,
      gmail_api_sender_name: senderName || '',
    };

    // Send email
    const result = await sendEmail(emailParams, config);

    if (!result.success) {
      return withCors(NextResponse.json({ error: result.error || 'Failed to send email' }, { status: 500 }));
    }

    // Get rate limit headers to include in response
    const rateLimitHeaders = getRateLimitHeaders(req);

    // Calculate attachment info for response
    const attachmentInfo =
      attachments && attachments.length > 0
        ? {
            count: attachments.length,
            totalSize: attachments.reduce((total, att) => {
              if (att.content) {
                try {
                  return total + Buffer.from(att.content, 'base64').length;
                } catch {
                  return total;
                }
              }
              return total;
            }, 0),
          }
        : undefined;

    return withCors(
      NextResponse.json(
        {
          success: true,
          messageId: result.messageId,
          message: 'Email sent successfully',
          ...(attachmentInfo && { attachments: attachmentInfo }),
        },
        {
          headers: rateLimitHeaders,
        },
      ),
    );
  } catch (error) {
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return withCors(NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 }));
    }

    return withCors(
      NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error occurred' }, { status: 500 }),
    );
  }
}

/**
 * OPTIONS /api/sendmail
 * Handles CORS preflight requests
 */
export async function OPTIONS() {
  return withCors(new NextResponse(null, { status: 204 }));
}
