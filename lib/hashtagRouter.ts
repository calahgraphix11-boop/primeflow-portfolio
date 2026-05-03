export function parseSection(caption: string): string | null {
  const lower = caption.toLowerCase()

  if (/#websites?\b/.test(lower)) return 'websites'
  if (/#brandings?\b/.test(lower)) return 'branding'
  if (/#flyers?\b/.test(lower)) return 'flyers'

  return null
}
