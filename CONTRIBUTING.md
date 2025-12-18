# Contributing to Mail Service

Thank you for your interest in contributing to Mail Service! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/daniil-aleksieiev/mail-service/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Node version, etc.)
   - Error messages or logs if applicable

### Suggesting Features

1. Check existing issues and discussions
2. Open a new issue with:
   - Clear description of the feature
   - Use case and motivation
   - Potential implementation approach (if you have ideas)

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes**:
   - Follow the existing code style
   - Add tests for new functionality
   - Update documentation if needed
4. **Test your changes**: Run `pnpm test` and `pnpm lint`
5. **Commit your changes**: Use clear, descriptive commit messages
6. **Push to your fork**: `git push origin feature/your-feature-name`
7. **Open a Pull Request** with:
   - Clear description of changes
   - Reference related issues
   - Screenshots (if UI changes)

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `pnpm install`
3. Set up environment variables (see README.md)
4. Run development server: `pnpm dev`
5. Run tests: `pnpm test`

## Code Style

- Use TypeScript for type safety
- Follow ESLint rules (run `pnpm lint`)
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

## Testing

- Write tests for new features
- Ensure all tests pass: `pnpm test`
- Aim for good test coverage
- Test edge cases and error scenarios

## Documentation

- Update README.md if adding features
- Add JSDoc comments for public functions
- Update examples if API changes
- Keep CHANGELOG.md updated

## Questions?

Feel free to open an issue for questions or discussions. We're here to help!

Thank you for contributing! 🎉
