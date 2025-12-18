import { isValidEmail, validateEmailAddresses } from '../email-validator';

describe('Email Validator', () => {
  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@example.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.com')).toBe(true);
      expect(isValidEmail('user_name@example-domain.com')).toBe(true);
      expect(isValidEmail('user123@example123.com')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('user..name@example.com')).toBe(false);
      expect(isValidEmail('user@example')).toBe(false);
      expect(isValidEmail('user @example.com')).toBe(false);
    });

    it('should reject emails longer than 254 characters', () => {
      const longEmail = 'a'.repeat(250) + '@example.com';
      expect(isValidEmail(longEmail)).toBe(false);
    });

    it('should reject empty or non-string values', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail(null as any)).toBe(false);
      expect(isValidEmail(undefined as any)).toBe(false);
      expect(isValidEmail(123 as any)).toBe(false);
    });

    it('should validate edge cases', () => {
      expect(isValidEmail('a@b.co')).toBe(true);
      expect(isValidEmail('test.email+tag@example-domain.co.uk')).toBe(true);
    });
  });

  describe('validateEmailAddresses', () => {
    it('should validate single email', () => {
      const result = validateEmailAddresses('test@example.com');
      expect(result.valid).toBe(true);
      expect(result.invalid).toEqual([]);
    });

    it('should validate multiple emails', () => {
      const result = validateEmailAddresses(['test@example.com', 'user@example.com']);
      expect(result.valid).toBe(true);
      expect(result.invalid).toEqual([]);
    });

    it('should identify invalid emails', () => {
      const result = validateEmailAddresses(['test@example.com', 'invalid', 'user@example.com']);
      expect(result.valid).toBe(false);
      expect(result.invalid).toEqual(['invalid']);
    });

    it('should handle mixed valid and invalid emails', () => {
      const result = validateEmailAddresses(['valid@example.com', 'invalid@', 'another@example.com', 'bad']);
      expect(result.valid).toBe(false);
      expect(result.invalid.length).toBe(2);
      expect(result.invalid).toContain('invalid@');
      expect(result.invalid).toContain('bad');
    });

    it('should trim email addresses', () => {
      const result = validateEmailAddresses('  test@example.com  ');
      expect(result.valid).toBe(true);
    });

    it('should handle empty array', () => {
      const result = validateEmailAddresses([]);
      expect(result.valid).toBe(true);
      expect(result.invalid).toEqual([]);
    });
  });
});
