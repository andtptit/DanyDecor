import sanitizeHtml from 'sanitize-html'

/**
 * Làm sạch HTML rich-text (mô tả sản phẩm) trước khi render bằng
 * dangerouslySetInnerHTML để tránh stored XSS. Chỉ cho phép các thẻ/định dạng
 * mà trình soạn thảo Tiptap sinh ra.
 */
export function sanitizeRichText(html: string | null | undefined): string {
  if (!html) return ''
  return sanitizeHtml(html, {
    allowedTags: [
      'p', 'br', 'span', 'strong', 'b', 'em', 'i', 'u', 's', 'strike',
      'ul', 'ol', 'li', 'blockquote', 'code', 'pre',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'hr',
    ],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      span: ['style'],
      p: ['style'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    // Chỉ cho phép một vài thuộc tính style vô hại
    allowedStyles: {
      '*': {
        'text-align': [/^left$/, /^right$/, /^center$/, /^justify$/],
        'color': [/^#(0x)?[0-9a-f]+$/i, /^rgb\(/i],
      },
    },
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }),
    },
  })
}

/**
 * Bóc toàn bộ thẻ HTML để lấy plain text (dùng cho meta description).
 */
export function htmlToPlainText(html: string | null | undefined, maxLength = 160): string {
  if (!html) return ''
  const text = html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).replace(/\s+\S*$/, '') + '…'
}
