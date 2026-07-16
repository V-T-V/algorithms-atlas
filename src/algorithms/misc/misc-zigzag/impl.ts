// Z 字形变换 · 实现
export interface ZigzagHooks {
  onRow?: (row: number, ch: string) => void;
  onConclude?: (result: string) => void;
}
export function miscZigzag(s: string, numRows: number, hooks: ZigzagHooks = {}): string {
  if (numRows <= 1 || numRows >= s.length) return s;
  const rows: string[] = new Array(numRows).fill('');
  let cur = 0;
  let goingDown = false;
  for (const ch of s) {
    rows[cur] += ch;
    hooks.onRow?.(cur, ch);
    if (cur === 0 || cur === numRows - 1) goingDown = !goingDown;
    cur += goingDown ? 1 : -1;
  }
  const result = rows.join('');
  hooks.onConclude?.(result);
  return result;
}
