/**
 * Validates email address format
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }

  // RFC 5322 compliant regex (simplified)
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  // Check length (max 254 characters per RFC 5321)
  if (email.length > 254) {
    return false;
  }

  // Check local and domain parts
  const parts = email.split('@');
  if (parts.length !== 2) {
    return false;
  }

  const [localPart, domain] = parts;

  // Local part validation (max 64 characters)
  if (localPart.length === 0 || localPart.length > 64) {
    return false;
  }

  // Domain validation
  if (domain.length === 0 || domain.length > 253) {
    return false;
  }

  // Domain must have at least one dot (TLD required)
  // Examples: example.com, sub.example.co.uk
  if (!domain.includes('.')) {
    return false;
  }

  // Check for consecutive dots
  if (email.includes('..')) {
    return false;
  }

  // Check that domain doesn't start or end with dot
  if (domain.startsWith('.') || domain.endsWith('.')) {
    return false;
  }

  return emailRegex.test(email);
}

/**
 * Validates multiple email addresses
 */
export function validateEmailAddresses(emails: string | string[]): {
  valid: boolean;
  invalid: string[];
} {
  const emailArray = Array.isArray(emails) ? emails : [emails];
  const invalid: string[] = [];

  for (const email of emailArray) {
    if (!isValidEmail(email.trim())) {
      invalid.push(email);
    }
  }

  return {
    valid: invalid.length === 0,
    invalid,
  };
}
