import {
  validateAttachmentSize,
  validateAttachmentType,
  validateAttachmentFilename,
  validateAttachments,
} from '../attachment-validator';
import type { Attachment } from '../google';

describe('attachment-validator', () => {
  describe('validateAttachmentSize', () => {
    it('should accept valid attachment size', () => {
      // Create a small base64 encoded content (1KB)
      const smallContent = Buffer.alloc(1024, 'a').toString('base64');
      const result = validateAttachmentSize(smallContent, 'test.txt');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject attachment exceeding 25MB', () => {
      // Create content larger than 25MB
      const largeContent = Buffer.alloc(26 * 1024 * 1024, 'a').toString('base64');
      const result = validateAttachmentSize(largeContent, 'large.txt');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceeds limit');
    });

    it('should reject invalid base64 content', () => {
      const invalidContent = 'not-base64!!!';
      const result = validateAttachmentSize(invalidContent, 'test.txt');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid base64');
    });
  });

  describe('validateAttachmentType', () => {
    it('should accept safe file types', () => {
      const result = validateAttachmentType('application/pdf', 'document.pdf');
      expect(result.valid).toBe(true);
    });

    it('should reject dangerous extensions', () => {
      const result = validateAttachmentType('application/octet-stream', 'virus.exe');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('dangerous');
    });

    it('should reject dangerous MIME types', () => {
      const result = validateAttachmentType('application/x-msdownload', 'installer.exe');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('dangerous');
    });
  });

  describe('validateAttachmentFilename', () => {
    it('should accept valid filenames', () => {
      const result = validateAttachmentFilename('document.pdf');
      expect(result.valid).toBe(true);
    });

    it('should reject empty filename', () => {
      const result = validateAttachmentFilename('');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('empty');
    });

    it('should reject path traversal attempts', () => {
      const result = validateAttachmentFilename('../../etc/passwd');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('path traversal');
    });

    it('should reject filenames with slashes', () => {
      const result = validateAttachmentFilename('path/to/file.txt');
      expect(result.valid).toBe(false);
    });

    it('should reject filenames with backslashes', () => {
      const result = validateAttachmentFilename('path\\to\\file.txt');
      expect(result.valid).toBe(false);
    });

    it('should reject filenames with null bytes', () => {
      const result = validateAttachmentFilename('file\0.txt');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('null bytes');
    });

    it('should reject very long filenames', () => {
      const longName = 'a'.repeat(256);
      const result = validateAttachmentFilename(longName);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('too long');
    });
  });

  describe('validateAttachments', () => {
    it('should accept empty attachments array', () => {
      const result = validateAttachments([]);
      expect(result.valid).toBe(true);
    });

    it('should accept valid attachments', () => {
      const attachments: Attachment[] = [
        {
          filename: 'doc.pdf',
          content: Buffer.alloc(1024, 'a').toString('base64'),
          contentType: 'application/pdf',
        },
      ];
      const result = validateAttachments(attachments);
      expect(result.valid).toBe(true);
    });

    it('should reject too many attachments', () => {
      const attachments: Attachment[] = Array(11).fill(null).map((_, i) => ({
        filename: `file${i}.txt`,
        content: Buffer.alloc(100, 'a').toString('base64'),
        contentType: 'text/plain',
      }));
      const result = validateAttachments(attachments);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Too many');
    });

    it('should reject attachments without content or url', () => {
      const attachments: Attachment[] = [
        {
          filename: 'file.txt',
          contentType: 'text/plain',
        },
      ];
      const result = validateAttachments(attachments);
      expect(result.valid).toBe(false);
      expect(result.invalid).toHaveLength(1);
    });

    it('should reject attachments with invalid filenames', () => {
      const attachments: Attachment[] = [
        {
          filename: '../../etc/passwd',
          content: Buffer.alloc(100, 'a').toString('base64'),
          contentType: 'text/plain',
        },
      ];
      const result = validateAttachments(attachments);
      expect(result.valid).toBe(false);
      expect(result.invalid).toHaveLength(1);
    });

    it('should accept attachments with URL', () => {
      const attachments: Attachment[] = [
        {
          filename: 'file.pdf',
          url: 'https://example.com/file.pdf',
          contentType: 'application/pdf',
        },
      ];
      const result = validateAttachments(attachments);
      expect(result.valid).toBe(true);
    });
  });
});
