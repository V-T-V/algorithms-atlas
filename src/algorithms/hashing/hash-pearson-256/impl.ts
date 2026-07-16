// Pearson 哈希 · 实现
export interface PearsonHooks {
  onByte?: (i: number, byte: number, h: number) => void;
  onConclude?: (hash: number) => void;
}
let T: number[] | null = null;
function getTable(): number[] {
  if (T) return T;
  let s = 98765;
  const rng = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s;
  };
  T = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = rng() % (i + 1);
    [T[i], T[j]] = [T[j]!, T[i]!];
  }
  return T;
}
export function pearsonHash(data: string, hooks: PearsonHooks = {}): number {
  const t = getTable();
  let h = 0;
  for (let i = 0; i < data.length; i++) {
    h = t[h ^ data.charCodeAt(i)]!;
    hooks.onByte?.(i, data.charCodeAt(i), h);
  }
  hooks.onConclude?.(h);
  return h;
}
