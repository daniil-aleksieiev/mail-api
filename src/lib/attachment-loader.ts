const MAX_ATTACHMENT_SIZE = 25 * 1024 * 1024; // 25MB in bytes
const LOAD_TIMEOUT = 30000; // 30 seconds

/**
 * Loads attachment from URL
 */
export async function loadAttachmentFromUrl(
  url: string,
  maxSize: number = MAX_ATTACHMENT_SIZE,
): Promise<{ content: string; size: number; contentType?: string }> {
  // Validate URL
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error(`Invalid URL: ${url}`);
  }

  // Only allow http and https protocols
  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    throw new Error(`Unsupported protocol: ${parsedUrl.protocol}. Only http:// and https:// are allowed`);
  }

  // Create AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), LOAD_TIMEOUT);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mail-Service/1.0',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Failed to load attachment from URL: ${response.status} ${response.statusText}`);
    }

    // Check Content-Length header if available
    const contentLength = response.headers.get('content-length');
    if (contentLength) {
      const size = parseInt(contentLength, 10);
      if (size > maxSize) {
        throw new Error(`Attachment size (${(size / 1024 / 1024).toFixed(2)}MB) exceeds limit of ${(maxSize / 1024 / 1024).toFixed(2)}MB`);
      }
    }

    // Get content type
    const contentType = response.headers.get('content-type') || undefined;

    // Read response as buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Check actual size
    if (buffer.length > maxSize) {
      throw new Error(`Attachment size (${(buffer.length / 1024 / 1024).toFixed(2)}MB) exceeds limit of ${(maxSize / 1024 / 1024).toFixed(2)}MB`);
    }

    // Encode to base64
    const content = buffer.toString('base64');

    return {
      content,
      size: buffer.length,
      contentType,
    };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error(`Timeout loading attachment from URL: ${url}`);
      }
      throw error;
    }

    throw new Error(`Unknown error loading attachment from URL: ${url}`);
  }
}
