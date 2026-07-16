// =============================================================================
// Trifid 三方阵密码 · 纯算法实现
// 27 字符集 = A-Z + '+'。排进 3 层 × 3 行 × 3 列。
// 每字符编码 = (层, 行, 列)，三个数字。
// 周期分组后把 [层...][行...][列...] 拼成一行，三三成组回查。
// =============================================================================
const DEFAULT_FILL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ+';

export function buildTrifidFill(keyword = ''): string {
  const seen = new Set<string>();
  const order: string[] = [];
  const allowed = (ch: string): boolean => /^[A-Z+]$/.test(ch);
  for (const ch of keyword.toUpperCase()) {
    if (allowed(ch) && !seen.has(ch)) {
      seen.add(ch);
      order.push(ch);
    }
  }
  for (const ch of DEFAULT_FILL) {
    if (!seen.has(ch)) order.push(ch);
  }
  return order.join('');
}

export interface TrifidHooks {
  onFill?: (fill: string) => void;
  onPeriod?: (periodIndex: number, combined: number[]) => void;
  onChar?: (i: number, original: string, mapped: string) => void;
}

export function trifidEncrypt(
  text: string,
  keyword = '',
  period = 5,
  hooks: TrifidHooks = {},
): string {
  const fill = buildTrifidFill(keyword);
  hooks.onFill?.(fill);
  const rc = new Map<string, [number, number, number]>();
  for (let i = 0; i < 27; i++) {
    rc.set(fill[i]!, [Math.floor(i / 9), Math.floor(i / 3) % 3, i % 3]);
  }
  // 只取合法字符
  const letters: string[] = [];
  for (let i = 0; i < text.length; i++) {
    const up = text[i]!.toUpperCase();
    if (rc.has(up)) letters.push(up);
  }
  // 按周期处理
  const p = Math.max(1, period);
  let out = '';
  for (let start = 0; start < letters.length; start += p) {
    const slice = letters.slice(start, start + p);
    const layers: number[] = [];
    const rows: number[] = [];
    const cols: number[] = [];
    for (const ch of slice) {
      const [l, r, c] = rc.get(ch)!;
      layers.push(l);
      rows.push(r);
      cols.push(c);
    }
    const combined = [...layers, ...rows, ...cols];
    hooks.onPeriod?.(start / p, combined);
    for (let i = 0; i + 2 < combined.length; i += 3) {
      const l = combined[i]!;
      const r = combined[i + 1]!;
      const c = combined[i + 2]!;
      out += fill[l * 9 + r * 3 + c]!;
    }
  }
  return out;
}
