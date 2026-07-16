// Excel 列名 · 实现
export interface ExcelTitleHooks {
  onDigit?: (ch: string) => void;
  onConclude?: (title: string) => void;
}
export function miscExcelColTitle2(n: number, hooks: ExcelTitleHooks = {}): string {
  let cur = n;
  const out: string[] = [];
  while (cur > 0) {
    cur--;
    const ch = String.fromCharCode(65 + (cur % 26));
    hooks.onDigit?.(ch);
    out.push(ch);
    cur = Math.floor(cur / 26);
  }
  const title = out.reverse().join('');
  hooks.onConclude?.(title);
  return title;
}
