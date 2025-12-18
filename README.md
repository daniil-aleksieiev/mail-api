# Mail Service

A simple email forwarding service built with Next.js that sends emails via Gmail API. Supports plain text, HTML templates, and automatic object formatting.

## Features

- 📧 Send emails via Gmail API
- 🎨 Support for plain text, HTML, and object-based emails
- 🔄 Automatic field name formatting (e.g., `full_name` → "Full Name")
- 📝 Template support with data substitution
- 🔐 OAuth 2.0 authentication with refresh tokens
- 🔒 API key authentication for secure access
- ⚡ Rate limiting to prevent abuse
- 🌐 CORS enabled for cross-origin requests

## Prerequisites

1. **Google Cloud Console Setup:**

   - Create a project in [Google Cloud Console](https://console.cloud.google.com/)
   - Enable Gmail API
   - Create OAuth 2.0 Client ID credentials
   - Add authorized redirect URI: `http://localhost:3000/api/auth/google/callback`

2. **Environment Variables:**
   Create a `.env` file in the root directory:

   ```env
   # Google OAuth credentials
   GMAIL_API_KEY=your-client-id.apps.googleusercontent.com
   GMAIL_SECRET=your-client-secret
   GMAIL_REFRESH_TOKEN=your-refresh-token
   GMAIL_SENDER_EMAIL=your-email@gmail.com
   GMAIL_SENDER_NAME=Your Name

   # API Security (optional but recommended for production)
   # If not set, API will be open (development mode)
   # Generate a strong random string: openssl rand -hex 32
   API_KEY=your-secret-api-key-here
   ```

## Getting Started

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Get Refresh Token:**

   - Start the development server: `pnpm dev`
   - Open in browser: `http://localhost:3000/api/auth/google`
   - Authorize the application
   - Copy the `refresh_token` from the response
   - Add it to your `.env` file as `GMAIL_REFRESH_TOKEN`

3. **Run the development server:**
   ```bash
   pnpm dev
   ```

## API Endpoints

### POST `/api/sendmail`

Sends an email via Gmail API.

**Security:**

- **API Key** (optional): If `API_KEY` is set in environment variables, you must provide it in:
  - Header: `X-API-Key: your-api-key`
  - Or: `Authorization: Bearer your-api-key`
- **Rate Limiting:**
  - With valid API key: 10 requests per minute
  - Without API key: 5 requests per minute
  - Rate limit information is included in response headers (not request): `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

**Request Headers:**

- `Content-Type: application/json` (required)
- `X-API-Key: your-api-key` (required if `API_KEY` env is set)
- Or `Authorization: Bearer your-api-key` (alternative to X-API-Key)

**Request Body:**

- `to` (required): Email address or array of addresses
- `subject` (required): Email subject
- `html` (optional): HTML content or object to format
- `text` (optional): Plain text content or object to format
- `fields` (optional): Object with key-value pairs (auto-formatted)
- `cc` (optional): CC recipients
- `bcc` (optional): BCC recipients
- `senderEmail` (optional): Override sender email from env
- `senderName` (optional): Override sender name from env
- `refreshToken` (optional): Override refresh token from env

## Usage Examples

### 1. Plain Text Email

```json
{
  "to": "recipient@example.com",
  "subject": "Hello",
  "text": "This is a plain text email."
}
```

### 2. HTML Email

```json
{
  "to": "recipient@example.com",
  "subject": "Welcome",
  "html": "<h1>Welcome!</h1><p>This is an HTML email.</p>"
}
```

### 3. Object-based Email (Auto-formatted)

The service automatically detects objects and formats them as a nice HTML table with plain text fallback.

```json
{
  "to": "recipient@example.com",
  "subject": "Customer Information",
  "fields": {
    "full_name": "John Doe",
    "customer-email": "john@doe.com",
    "company": "John's Company",
    "phone_number": "+1 234 567 8900"
  }
}
```

**Result:**

- Field names are automatically formatted: `full_name` → "Full Name", `customer-email` → "Customer Email"
- HTML: Formatted as a table
- Text: Formatted as key-value pairs

### 4. Using `text` or `html` with Objects

You can also pass objects directly to `text` or `html` fields:

```json
{
  "to": "recipient@example.com",
  "subject": "Order Details",
  "html": {
    "order_id": "12345",
    "total_amount": "$99.99",
    "order_date": "2024-01-15"
  }
}
```

### 5. Template with Data Substitution

```json
{
  "to": "recipient@example.com",
  "subject": "Welcome {{name}}!",
  "template": {
    "html": "<h1>Hello {{name}}!</h1><p>Your email is {{email}}</p>",
    "text": "Hello {{name}}! Your email is {{email}}"
  },
  "data": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### 6. Multiple Recipients

```json
{
  "to": ["recipient1@example.com", "recipient2@example.com"],
  "cc": "cc@example.com",
  "bcc": "bcc@example.com",
  "subject": "Team Update",
  "html": "<h1>Team Update</h1><p>This is an update for the team.</p>"
}
```

## Testing with Postman

### 1. Get Refresh Token

**GET** `http://localhost:3000/api/auth/google`

Open this URL in your browser, authorize, and copy the `refresh_token` from the response.

### 2. Send Plain Text Email

**POST** `http://localhost:3000/api/sendmail`

**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
  "to": "recipient@example.com",
  "subject": "Test Email",
  "text": "This is a test email."
}
```

### 4. Send HTML Email

**POST** `http://localhost:3000/api/sendmail`

**Headers:**

```
Content-Type: application/json
X-API-Key: your-api-key-here
```

**Body:**

```json
{
  "to": "recipient@example.com",
  "subject": "Test HTML Email",
  "html": "<h1>Hello!</h1><p>This is an <strong>HTML</strong> email.</p>"
}
```

### 5. Send Object-based Email

**POST** `http://localhost:3000/api/sendmail`

**Headers:**

```
Content-Type: application/json
X-API-Key: your-api-key-here
```

**Body:**

```json
{
  "to": "recipient@example.com",
  "subject": "Customer Information",
  "fields": {
    "full_name": "John Doe",
    "customer-email": "john@doe.com",
    "company": "John's Company",
    "phone_number": "+1 234 567 8900"
  }
}
```

### 6. Send Template Email

**POST** `http://localhost:3000/api/sendmail`

**Headers:**

```
Content-Type: application/json
X-API-Key: your-api-key-here
```

**Body:**

```json
{
  "to": "recipient@example.com",
  "subject": "Order #{{orderId}}",
  "template": "<html><body><h1>Order #{{orderId}}</h1><p>Total: ${{total}}</p></body></html>",
  "data": {
    "orderId": "12345",
    "total": "99.99"
  }
}
```

## Response Format

### Success Response

```json
{
  "success": true,
  "messageId": "18cxxxxxxxxxxxxxxxxxxxxx",
  "message": "Email sent successfully"
}
```

### Error Response

```json
{
  "error": "Field \"to\" is required"
}
```

## Field Name Formatting

The service automatically formats field names:

- `full_name` → "Full Name"
- `customer-email` → "Customer Email"
- `phone_number` → "Phone Number"
- `order_date` → "Order Date"

Works with both underscores (`_`) and hyphens (`-`).

## Content Detection

The service automatically detects content type:

1. **String with HTML tags** → Treated as HTML
2. **Plain string** → Treated as text
3. **Object** → Auto-formatted as HTML table + plain text

## Security

### API Key Protection

1. **Generate a strong API key:**

   ```bash
   openssl rand -hex 32
   ```

2. **Add to environment variables:**

   ```env
   API_KEY=your-generated-key-here
   ```

3. **Use in requests:**

   - Header: `X-API-Key: your-api-key`
   - Or: `Authorization: Bearer your-api-key`

4. **Development Mode:**
   - If `API_KEY` is not set, the API is open (for development only)
   - **Never deploy to production without setting `API_KEY`**

### Rate Limiting

- **With API Key:** 10 requests per minute
- **Without API Key:** 5 requests per minute
- Rate limits are per API key or IP address
- Rate limit info is included in response headers

### Best Practices

1. **Always set `API_KEY` in production**
2. **Use HTTPS** in production (Vercel provides this automatically)
3. **Keep your API key secret** - never commit it to git
4. **Rotate API keys** periodically
5. **Monitor rate limits** using response headers

## Troubleshooting

### Error: "API key is required"

- Set `API_KEY` in your `.env` file, or
- Provide API key in `X-API-Key` header or `Authorization: Bearer <token>`

### Error: "Invalid API key"

- Check that the API key in your request matches `API_KEY` in environment variables
- Ensure there are no extra spaces or characters

### Error: "Rate limit exceeded"

- Wait for the rate limit window to reset (check `Retry-After` header)
- Use a valid API key to get higher rate limits (10/min vs 5/min)
- Consider implementing request queuing on the client side

### Error: "invalid_grant"

This usually means:

1. Redirect URI mismatch - ensure it matches exactly in Google Cloud Console
2. Refresh token expired or revoked - get a new one via `/api/auth/google`
3. Client ID mismatch - ensure `GMAIL_API_KEY` matches the one used for authorization

### Error: "refreshToken is required"

Add `GMAIL_REFRESH_TOKEN` to your `.env` file or pass it in the request body.

### Error: "senderEmail is required"

Add `GMAIL_SENDER_EMAIL` to your `.env` file or pass it in the request body.

## Project Structure

```
mail-service/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── google/
│   │   │       ├── route.ts          # OAuth initiation
│   │   │       └── callback/
│   │   │           └── route.ts      # OAuth callback
│   │   └── sendmail/
│   │       └── route.ts              # Email sending endpoint
│   └── ...
├── src/
│   └── lib/
│       ├── auth.ts                   # API key authentication
│       ├── cors.ts                    # CORS utility
│       ├── email-parser.ts            # Content parsing logic
│       ├── google.ts                  # Gmail API integration
│       └── rate-limit.ts              # Rate limiting logic
└── ...
```

## Deployment

### Deploy to Vercel

1. **Push to GitHub:**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Import to Vercel:**

   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables:
     - `GMAIL_API_KEY`
     - `GMAIL_SECRET`
     - `GMAIL_REFRESH_TOKEN`
     - `GMAIL_SENDER_EMAIL`
     - `GMAIL_SENDER_NAME`
     - `API_KEY` (generate a strong key: `openssl rand -hex 32`)

3. **Update Redirect URI:**

   - In Google Cloud Console, add your production callback URL:
     `https://your-domain.vercel.app/api/auth/google/callback`

4. **Deploy:**
   - Vercel will automatically deploy on push
   - Your API will be available at `https://your-domain.vercel.app/api/sendmail`

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Gmail API Documentation](https://developers.google.com/gmail/api)
- [OAuth 2.0 for Web Applications](https://developers.google.com/identity/protocols/oauth2/web-server)
