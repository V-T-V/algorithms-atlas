// rANS · 实现（简化）
export interface RansHooks {
  onEncode?: (sym: number, state: number) => void;
  onResult?: (state: number) => void;
}
export interface RansSym {
  sym: number;
  freq: number;
  cumStart: number;
}
export function ransEncode(
  data: number[],
  table: Map<number, RansSym>,
  M: number,
  hooks: RansHooks = {},
): number {
  let x = M; // 初始状态
  for (let i = data.length - 1; i >= 0; i--) {
    const sym = data[i]!;
    const s = table.get(sym)!;
    x = Math.floor(x / s.freq) * M + (x % s.freq) + s.cumStart;
    hooks.onEncode?.(sym, x);
  }
  hooks.onResult?.(x);
  return x;
}
export function ransDecode(
  x: number,
  table: Map<number, RansSym>,
  M: number,
  n: number,
  bySlot: (slot: number) => number,
): number[] {
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const slot = x % M;
    const sym = bySlot(slot);
    const s = table.get(sym)!;
    x = s.freq * Math.floor(x / M) + slot - s.cumStart;
    out.push(sym);
  }
  // 编码时按 i=n-1..0 逆序处理，解码自然恢复成原始顺序 s[0..n-1]，无需 reverse。
  return out;
}
