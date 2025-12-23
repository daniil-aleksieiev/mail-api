# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Email attachments support:
  - Base64 encoded attachments
  - URL-based attachments (automatic download)
  - Multiple attachments per email (up to 10)
  - Attachment size validation (25MB limit per file)
  - Attachment type validation (blocks dangerous file types)
  - Filename security validation (prevents path traversal)
  - Automatic MIME encoding for attachments
- Unit tests for attachment validation and loading
- Documentation for attachments in `_docs/attachments.md`
- Postman testing guide for attachments in `_docs/postman-attachments.md`

## [0.1.0] - 2025-12-18

### Added

- Initial release
- Gmail API integration with OAuth 2.0 authentication
- OAuth endpoints: `/api/auth/google` and `/api/auth/google/callback`
- Email sending endpoint: `POST /api/sendmail`
- Support for multiple email content types:
  - Plain text emails
  - HTML emails
  - Object-based emails with automatic formatting
  - Template support with data substitution (`{{key}}` syntax)
- Automatic field name formatting (e.g., `full_name` → "Full Name")
- Email address validation (RFC 5322 compliant) for all recipient fields (to, cc, bcc, replyTo)
- Email size validation (25MB Gmail API limit)
- Reply-To header support
- CC and BCC support
- API key authentication (optional, via `X-API-Key` header or `Authorization: Bearer`)
- Rate limiting:
  - 10 requests/minute with API key
  - 5 requests/minute without API key
  - Rate limit info in response headers
- CORS support for cross-origin requests
- Webhook endpoint (`/api/webhook`) for delivery status notifications
- Beautiful dark-themed landing page with:
  - Project features showcase
  - API endpoint documentation
  - Security information
  - Quick start guide
  - Links to GitHub and LinkedIn
- Comprehensive README with:
  - Setup instructions
  - API documentation
  - Usage examples in multiple languages (cURL, Node.js, Python)
  - Security best practices
  - Troubleshooting guide
  - Project limitations and warnings
- Unit tests for email validation and content parsing
- Jest configuration for testing
- MIT License
- Contributing guidelines (CONTRIBUTING.md)
- Changelog (this file)

### Security

- API key authentication middleware
- Rate limiting to prevent abuse
- Email address validation prevents invalid addresses
- Sanitized error messages (no sensitive data exposure)
- OAuth callback endpoint restricted to localhost by default
- Access token removed from OAuth callback response
- Redirect URI removed from error responses
- Gmail API error messages sanitized

### Changed

- Enhanced Gmail API error handling with user-friendly messages
- Improved MIME message creation with reply-to support
- Better error messages for debugging without exposing internals
