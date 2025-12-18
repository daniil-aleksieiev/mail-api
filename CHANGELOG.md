# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Email address validation for all recipient fields (to, cc, bcc, replyTo)
- Improved Gmail API error handling with detailed error messages
- Email size validation (25MB Gmail API limit)
- Reply-To header support
- Webhook endpoint for delivery status notifications (`/api/webhook`)
- Unit tests for email validation and parsing
- MIT License
- Contributing guidelines
- Changelog
- Examples in multiple programming languages (cURL, Node.js, Python, PHP, Go)
- Comprehensive limitations and warnings section in README

### Changed
- Enhanced error messages for better debugging
- Improved MIME message creation with reply-to support
- Updated README with project scope clarification (small to medium projects)

### Security
- Email validation prevents invalid addresses from being sent

## [0.1.0] - 2025-01-XX

### Added
- Initial release
- Gmail API integration with OAuth 2.0
- Email sending with support for text, HTML, and object-based content
- Automatic field name formatting
- Template support with data substitution
- API key authentication
- Rate limiting (10/min with key, 5/min without)
- CORS support
- Beautiful landing page
- Comprehensive documentation

[Unreleased]: https://github.com/daniil-aleksieiev/mail-service/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/daniil-aleksieiev/mail-service/releases/tag/v0.1.0
