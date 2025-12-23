import { loadAttachmentFromUrl } from '../attachment-loader';

// Mock fetch
global.fetch = jest.fn();

describe('attachment-loader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loadAttachmentFromUrl', () => {
    it('should load attachment from valid URL', async () => {
      const mockContent = Buffer.from('test content');
      // Create proper ArrayBuffer from Buffer
      const arrayBuffer = mockContent.buffer.slice(
        mockContent.byteOffset,
        mockContent.byteOffset + mockContent.byteLength,
      );
      const mockResponse = {
        ok: true,
        headers: new Headers({
          'content-type': 'application/pdf',
          'content-length': String(mockContent.length),
        }),
        arrayBuffer: jest.fn().mockResolvedValue(arrayBuffer),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await loadAttachmentFromUrl('https://example.com/file.pdf');

      expect(result.content).toBe(mockContent.toString('base64'));
      expect(result.size).toBe(mockContent.length);
      expect(result.contentType).toBe('application/pdf');
      expect(global.fetch).toHaveBeenCalledWith('https://example.com/file.pdf', expect.any(Object));
    });

    it('should reject invalid URL', async () => {
      await expect(loadAttachmentFromUrl('not-a-url')).rejects.toThrow('Invalid URL');
    });

    it('should reject non-http protocols', async () => {
      await expect(loadAttachmentFromUrl('ftp://example.com/file.pdf')).rejects.toThrow('Unsupported protocol');
    });

    it('should reject file protocol', async () => {
      await expect(loadAttachmentFromUrl('file:///path/to/file.pdf')).rejects.toThrow('Unsupported protocol');
    });

    it('should reject failed HTTP responses', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found',
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await expect(loadAttachmentFromUrl('https://example.com/missing.pdf')).rejects.toThrow('Failed to load');
    });

    it('should reject files exceeding size limit', async () => {
      const largeContent = Buffer.alloc(26 * 1024 * 1024); // 26MB
      const arrayBuffer = largeContent.buffer.slice(
        largeContent.byteOffset,
        largeContent.byteOffset + largeContent.byteLength,
      );
      const mockResponse = {
        ok: true,
        headers: new Headers({
          'content-length': String(largeContent.length),
        }),
        arrayBuffer: jest.fn().mockResolvedValue(arrayBuffer),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await expect(loadAttachmentFromUrl('https://example.com/large.pdf')).rejects.toThrow('exceeds limit');
    });

    it('should handle timeout', async () => {
      // Mock fetch to reject with AbortError (simulating timeout)
      const abortError = new Error('The operation was aborted');
      abortError.name = 'AbortError';

      (global.fetch as jest.Mock).mockRejectedValue(abortError);

      // The function should catch AbortError and throw a timeout error
      await expect(loadAttachmentFromUrl('https://example.com/slow.pdf')).rejects.toThrow('Timeout');
    });

    it('should work without content-type header', async () => {
      const mockContent = Buffer.from('test content');
      const arrayBuffer = mockContent.buffer.slice(
        mockContent.byteOffset,
        mockContent.byteOffset + mockContent.byteLength,
      );
      const mockResponse = {
        ok: true,
        headers: new Headers({
          'content-length': String(mockContent.length),
        }),
        arrayBuffer: jest.fn().mockResolvedValue(arrayBuffer),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await loadAttachmentFromUrl('https://example.com/file.pdf');

      expect(result.contentType).toBeUndefined();
      expect(result.content).toBe(mockContent.toString('base64'));
    });
  });
});
