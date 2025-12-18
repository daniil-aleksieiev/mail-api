import { parseEmailContent } from '../email-parser';

describe('Email Parser', () => {
  describe('parseEmailContent', () => {
    it('should detect HTML content', () => {
      const html = '<h1>Hello</h1><p>World</p>';
      const result = parseEmailContent(html);
      expect(result.html).toBe(html);
      expect(result.text).toBeUndefined();
    });

    it('should detect HTML with attributes', () => {
      const html = '<div class="container"><p>Content</p></div>';
      const result = parseEmailContent(html);
      expect(result.html).toBe(html);
      expect(result.text).toBeUndefined();
    });

    it('should detect plain text content', () => {
      const text = 'Hello World';
      const result = parseEmailContent(text);
      expect(result.text).toBe(text);
      expect(result.html).toBeUndefined();
    });

    it('should detect plain text with special characters', () => {
      const text = 'Hello, World! This is a test email.';
      const result = parseEmailContent(text);
      expect(result.text).toBe(text);
      expect(result.html).toBeUndefined();
    });

    it('should format object as HTML table and text', () => {
      const obj = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
      };
      const result = parseEmailContent(obj);
      expect(result.html).toContain('<table');
      expect(result.html).toContain('Name');
      expect(result.html).toContain('John Doe');
      expect(result.html).toContain('Email');
      expect(result.html).toContain('john@example.com');
      expect(result.html).toContain('Age');
      expect(result.html).toContain('30');
      expect(result.text).toContain('Name: John Doe');
      expect(result.text).toContain('Email: john@example.com');
      expect(result.text).toContain('Age: 30');
    });

    it('should format field names correctly', () => {
      const obj = {
        full_name: 'John Doe',
        'customer-email': 'john@example.com',
        phone_number: '+1234567890',
        order_date: '2025-01-15',
      };
      const result = parseEmailContent(obj);
      expect(result.html).toContain('Full Name');
      expect(result.html).toContain('Customer Email');
      expect(result.html).toContain('Phone Number');
      expect(result.html).toContain('Order Date');
      expect(result.text).toContain('Full Name: John Doe');
      expect(result.text).toContain('Customer Email: john@example.com');
    });

    it('should handle empty object', () => {
      const obj = {};
      const result = parseEmailContent(obj);
      expect(result.html).toContain('<table');
      expect(result.text).toBe('');
    });

    it('should handle object with null/undefined values', () => {
      const obj = {
        name: 'John',
        email: null,
        phone: undefined,
        age: 0,
      };
      const result = parseEmailContent(obj);
      expect(result.html).toContain('Name');
      expect(result.html).toContain('John');
      expect(result.text).toContain('Name: John');
    });

    it('should handle arrays as text', () => {
      const arr = ['item1', 'item2', 'item3'];
      const result = parseEmailContent(arr);
      expect(result.text).toBe('item1,item2,item3');
      expect(result.html).toBeUndefined();
    });

    it('should handle numbers as text', () => {
      const num = 12345;
      const result = parseEmailContent(num);
      expect(result.text).toBe('12345');
      expect(result.html).toBeUndefined();
    });

    it('should handle boolean as text', () => {
      const bool = true;
      const result = parseEmailContent(bool);
      expect(result.text).toBe('true');
      expect(result.html).toBeUndefined();
    });

    it('should handle complex nested object (flattened)', () => {
      const obj = {
        user: {
          name: 'John',
          email: 'john@example.com',
        },
      };
      const result = parseEmailContent(obj);
      // Objects are stringified, so we check for the string representation
      expect(result.html).toContain('<table');
      expect(result.text).toBeTruthy();
    });

    it('should not treat text with < as HTML if not a tag', () => {
      const text = 'Price < $100';
      const result = parseEmailContent(text);
      expect(result.text).toBe(text);
      expect(result.html).toBeUndefined();
    });

    it('should detect HTML even with minimal tags', () => {
      const html = '<p>test</p>';
      const result = parseEmailContent(html);
      expect(result.html).toBe(html);
      expect(result.text).toBeUndefined();
    });
  });
});
