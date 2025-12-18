/**
 * Converts field names with underscores or hyphens to readable text
 * Examples: "full_name" -> "Full Name", "customer-email" -> "Customer Email"
 */
function formatFieldName(fieldName: string): string {
  return fieldName
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Checks if a value is a plain object (not array, null, or Date)
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof Date) &&
    Object.prototype.toString.call(value) === '[object Object]'
  );
}

/**
 * Converts an object to formatted HTML table
 */
function objectToHtmlTable(data: Record<string, unknown>): string {
  let html = '<table style="border-collapse: collapse; width: 100%; max-width: 600px; margin: 20px 0;">';

  for (const [key, value] of Object.entries(data)) {
    const formattedKey = formatFieldName(key);
    const formattedValue = String(value || '');

    html += `
      <tr style="border-bottom: 1px solid #e0e0e0;">
        <td style="padding: 12px; font-weight: bold; color: #333; width: 40%;">${formattedKey}:</td>
        <td style="padding: 12px; color: #666;">${formattedValue}</td>
      </tr>
    `;
  }

  html += '</table>';
  return html;
}

/**
 * Converts an object to formatted plain text
 */
function objectToText(data: Record<string, unknown>): string {
  let text = '';

  for (const [key, value] of Object.entries(data)) {
    const formattedKey = formatFieldName(key);
    text += `${formattedKey}: ${value || ''}\n`;
  }

  return text.trim();
}

/**
 * Parses email content and determines if it's text, object, or HTML
 * Returns formatted HTML and text versions
 */
export function parseEmailContent(content: unknown): { html?: string; text?: string } {
  // If content is a string
  if (typeof content === 'string') {
    // Check if it looks like HTML (contains HTML tags)
    const htmlTagPattern = /<[a-z][\s\S]*>/i;
    if (htmlTagPattern.test(content)) {
      return { html: content };
    }
    // Otherwise treat as plain text
    return { text: content };
  }

  // If content is a plain object
  if (isPlainObject(content)) {
    const html = objectToHtmlTable(content);
    const text = objectToText(content);
    return { html, text };
  }

  // If content is an array or other type, convert to string
  return { text: String(content) };
}
