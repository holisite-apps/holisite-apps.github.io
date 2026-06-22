export const META_DESCRIPTION_MIN = 25;
export const META_DESCRIPTION_MAX = 160;

export function normalizeMetaDescription(value: string): string {
  const collapsed = value.replace(/\s+/g, " ").trim();

  if (!collapsed) {
    return collapsed;
  }

  if (
    collapsed.length >= META_DESCRIPTION_MIN &&
    collapsed.length <= META_DESCRIPTION_MAX
  ) {
    return collapsed;
  }

  if (collapsed.length < META_DESCRIPTION_MIN) {
    return collapsed;
  }

  let truncated = collapsed.slice(0, META_DESCRIPTION_MAX);
  const lastSpace = truncated.lastIndexOf(" ");

  if (lastSpace >= META_DESCRIPTION_MIN) {
    truncated = truncated.slice(0, lastSpace);
  }

  return truncated.replace(/[,.;:\-–—\s]+$/u, "").trim();
}
