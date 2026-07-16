// Excel 列号 · 实现
export interface ExcelNumHooks {
  onChar?: (ch: string, acc: number) => void;
  onConclude?: (num: number) => void;
}
export function miscExcelColNum(title: string, hooks: ExcelNumHooks = {}): number {
  let acc = 0;
  for (const ch of title) {
    acc = acc * 26 + (ch.charCodeAt(0) - 64);
    hooks.onChar?.(ch, acc);
  }
  hooks.onConclude?.(acc);
  return acc;
}
