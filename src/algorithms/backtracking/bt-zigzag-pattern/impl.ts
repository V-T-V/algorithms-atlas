export interface ZzHooks {
  onPlace?: (ch: string, row: number) => void;
  onResult?: (s: string) => void;
}
export function convert(s: string, numRows: number, hooks: ZzHooks = {}): string {
  if (numRows === 1 || s.length <= numRows) return s;
  const rows: string[] = new Array(numRows).fill('');
  let r = 0,
    step = 1;
  for (const ch of s) {
    rows[r] += ch;
    hooks.onPlace?.(ch, r);
    if (r === 0) step = 1;
    else if (r === numRows - 1) step = -1;
    r += step;
  }
  const out = rows.join('');
  hooks.onResult?.(out);
  return out;
}
