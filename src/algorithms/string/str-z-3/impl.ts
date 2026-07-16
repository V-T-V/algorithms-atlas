// =============================================================================
// Z 函数：z[i] = s 与 s[i..] 的最长公共前缀长度
// =============================================================================

export interface ZHooks {
  onProbe?: (i: number, value: number) => void;
  onBox?: (l: number, r: number) => void;
  onDone?: (z: number[]) => void;
}

export function zFunction(s: string, hooks: ZHooks = {}): number[] {
  const n = s.length;
  const z = new Array<number>(n).fill(0);
  if (n === 0) return z;
  z[0] = n;
  let l = 0;
  let r = 0;
  for (let i = 1; i < n; i++) {
    if (i < r) {
      z[i] = Math.min(r - i, z[i - l]!);
    }
    while (i + z[i]! < n && s[z[i]!] === s[i + z[i]!]) z[i] = z[i]! + 1;
    hooks.onProbe?.(i, z[i]!);
    if (i + z[i]! > r) {
      l = i;
      r = i + z[i]!;
      hooks.onBox?.(l, r);
    }
  }
  hooks.onDone?.(z);
  return z;
}

/** 用 Z 函数做模式匹配：拼接 pat + '#' + text，z 值等于 m 的位置即匹配起点。 */
export function zMatch(text: string, pat: string, hooks: ZHooks = {}): number[] {
  const sep = '#';
  const combined = pat + sep + text;
  const z = zFunction(combined, hooks);
  const m = pat.length;
  const result: number[] = [];
  for (let i = m + 1; i < combined.length; i++) {
    if (z[i] === m) result.push(i - m - 1);
  }
  return result;
}
