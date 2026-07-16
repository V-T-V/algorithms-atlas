export interface PtHooks {
  onSlot?: (name: string, content: string) => void;
}
export function renderPage(
  title: string,
  slots: Record<string, string>,
  hooks: PtHooks = {},
): string {
  const slotHtml = Object.entries(slots)
    .map(([k, v]) => {
      hooks.onSlot?.(k, v);
      return '<div id="' + k + '">' + v + '</div>';
    })
    .join('');
  return '<html><head><title>' + title + '</title></head><body>' + slotHtml + '</body></html>';
}
