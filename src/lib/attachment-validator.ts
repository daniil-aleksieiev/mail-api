import type { Attachment } from './google';

const MAX_ATTACHMENT_SIZE = 25 * 1024 * 1024; // 25MB in bytes
const MAX_ATTACHMENTS_COUNT = 10;

/**
 * Validates attachment size
 * Base64 content is already encoded, so we need to decode it to get real size
 */
export function validateAttachmentSize(content: string, filename: string): { valid: boolean; error?: string } {
  try {
    // Validate base64 format first
    // Base64 strings should only contain A-Z, a-z, 0-9, +, /, and = for padding
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    if (!base64Regex.test(content)) {
      return {
        valid: false,
        error: `Invalid base64 content for attachment "${filename}": Invalid base64 format`,
      };
    }

    // Base64 increases size by ~33%, so we decode to get actual size
    const buffer = Buffer.from(content, 'base64');
    const size = buffer.length;

    // Check if decoded buffer is empty or suspiciously small for non-empty base64
    // This helps catch cases where base64 is invalid but passes regex
    if (content.length > 0 && size === 0) {
      return {
        valid: false,
        error: `Invalid base64 content for attachment "${filename}": Unable to decode base64`,
      };
    }

    if (size > MAX_ATTACHMENT_SIZE) {
      return {
        valid: false,
        error: `Attachment "${filename}" size (${(size / 1024 / 1024).toFixed(2)}MB) exceeds limit of 25MB`,
      };
    }

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: `Invalid base64 content for attachment "${filename}": ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    };
  }
}

/**
 * Validates attachment type (optional - can be used to block dangerous file types)
 */
export function validateAttachmentType(contentType: string, filename: string): { valid: boolean; error?: string } {
  // Optional: Block dangerous file types
  const dangerousExtensions = ['.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js'];
  const dangerousMimeTypes = [
    'application/x-msdownload',
    'application/x-executable',
    'application/x-msdos-program',
    'application/x-ms-installer',
  ];

  const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  if (dangerousExtensions.includes(extension)) {
    return {
      valid: false,
      error: `Attachment "${filename}" has a potentially dangerous file type`,
    };
  }

  if (dangerousMimeTypes.includes(contentType.toLowerCase())) {
    return {
      valid: false,
      error: `Attachment "${filename}" has a potentially dangerous MIME type: ${contentType}`,
    };
  }

  return { valid: true };
}

/**
 * Validates attachment filename for security
 */
export function validateAttachmentFilename(filename: string): { valid: boolean; error?: string } {
  if (!filename || filename.trim() === '') {
    return {
      valid: false,
      error: 'Attachment filename cannot be empty',
    };
  }

  // Check for path traversal attempts
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return {
      valid: false,
      error: `Invalid filename "${filename}": path traversal characters not allowed`,
    };
  }

  // Check for null bytes
  if (filename.includes('\0')) {
    return {
      valid: false,
      error: `Invalid filename "${filename}": null bytes not allowed`,
    };
  }

  // Check filename length (reasonable limit)
  if (filename.length > 255) {
    return {
      valid: false,
      error: `Filename "${filename}" is too long (max 255 characters)`,
    };
  }

  return { valid: true };
}

/**
 * Main function to validate all attachments
 */
export function validateAttachments(attachments: Attachment[]): {
  valid: boolean;
  error?: string;
  invalid?: Attachment[];
} {
  if (!attachments || attachments.length === 0) {
    return { valid: true };
  }

  // Check count
  if (attachments.length > MAX_ATTACHMENTS_COUNT) {
    return {
      valid: false,
      error: `Too many attachments (${attachments.length}). Maximum allowed: ${MAX_ATTACHMENTS_COUNT}`,
    };
  }

  const invalid: Attachment[] = [];
  let totalSize = 0;

  for (const attachment of attachments) {
    // Validate filename
    const filenameValidation = validateAttachmentFilename(attachment.filename);
    if (!filenameValidation.valid) {
      invalid.push(attachment);
      continue;
    }

    // Validate type (optional check)
    const typeValidation = validateAttachmentType(attachment.contentType, attachment.filename);
    if (!typeValidation.valid) {
      invalid.push(attachment);
      continue;
    }

    // Validate size if content is provided
    if (attachment.content) {
      const sizeValidation = validateAttachmentSize(attachment.content, attachment.filename);
      if (!sizeValidation.valid) {
        invalid.push(attachment);
        continue;
      }

      // Calculate actual size for total
      try {
        const buffer = Buffer.from(attachment.content, 'base64');
        totalSize += buffer.length;
      } catch {
        invalid.push(attachment);
        continue;
      }
    } else if (!attachment.url) {
      // Either content or url must be provided
      invalid.push(attachment);
      continue;
    }

    // Check if total size exceeds limit (rough estimate)
    if (totalSize > MAX_ATTACHMENT_SIZE) {
      return {
        valid: false,
        error: `Total attachments size exceeds limit of 25MB`,
        invalid,
      };
    }
  }

  if (invalid.length > 0) {
    return {
      valid: false,
      error: `Invalid attachments found`,
      invalid,
    };
  }

  return { valid: true };
}
