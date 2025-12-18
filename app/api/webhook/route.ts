import { NextRequest, NextResponse } from 'next/server';
import { withCors } from '@/src/lib/cors';
import { requireApiKey } from '@/src/lib/auth';

/**
 * POST /api/webhook
 * Webhook endpoint for email delivery status notifications
 *
 * This endpoint can be called by external services to notify about email delivery status.
 * In a production environment, you might want to integrate with Gmail Push notifications
 * or use a service like SendGrid webhooks.
 */
export async function POST(req: NextRequest) {
  // Check API key (if API_KEY is set in env)
  const authError = requireApiKey(req);
  if (authError) {
    return authError;
  }

  try {
    const body = await req.json();

    // Validate webhook payload
    if (!body.messageId) {
      return withCors(NextResponse.json({ error: 'Field "messageId" is required' }, { status: 400 }));
    }

    if (!body.status) {
      return withCors(NextResponse.json({ error: 'Field "status" is required' }, { status: 400 }));
    }

    // Valid statuses: sent, delivered, bounced, failed, opened, clicked
    const validStatuses = ['sent', 'delivered', 'bounced', 'failed', 'opened', 'clicked'];
    if (!validStatuses.includes(body.status)) {
      return withCors(
        NextResponse.json(
          { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
          { status: 400 },
        ),
      );
    }

    // In a real implementation, you would:
    // 1. Store the webhook event in a database
    // 2. Trigger any configured callbacks
    // 3. Send notifications if needed
    // 4. Log the event for analytics

    // For now, we just acknowledge receipt
    return withCors(
      NextResponse.json({
        success: true,
        message: 'Webhook received',
        messageId: body.messageId,
        status: body.status,
        timestamp: new Date().toISOString(),
      }),
    );
  } catch (error) {
    return withCors(
      NextResponse.json(
        { error: error instanceof Error ? error.message : 'Invalid JSON in request body' },
        { status: 400 },
      ),
    );
  }
}

/**
 * GET /api/webhook
 * Webhook verification endpoint (for services that require verification)
 */
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const challenge = searchParams.get('challenge');
  const token = searchParams.get('token');

  // Simple verification - in production, verify against your webhook configuration
  if (challenge && token) {
    return withCors(NextResponse.json({ challenge }));
  }

  return withCors(NextResponse.json({ message: 'Webhook endpoint is active' }));
}

/**
 * OPTIONS /api/webhook
 * Handles CORS preflight requests
 */
export async function OPTIONS() {
  return withCors(new NextResponse(null, { status: 204 }));
}
