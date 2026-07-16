// 表格哈希 · 实现
const MASK64 = (1n << 64n) - 1n;

// 16 个字节位置 × 256 个值的随机表
const MAX_POS = 16;
const TABLE: bigint[][] = (() => {
  const t: bigint[][] = [];
  let s = 0x9e3779b97f4a7c15n;
  for (let c = 0; c < MAX_POS; c++) {
    const col: bigint[] = new Array(256);
    for (let v = 0; v < 256; v++) {
      s = (s * 6364136223846793005n + 1442695040888963407n) & MASK64;
      col[v] = s;
    }
    t.push(col);
  }
  return t;
})();

export interface TabulationHooks {
  onByte?: (position: number, byte: number, partialHash: bigint) => void;
  onResult?: (hash: bigint) => void;
}

export function tabulationHash(
  data: string | readonly number[],
  hooks: TabulationHooks = {},
): bigint {
  const bytes = typeof data === 'string' ? Array.from(new TextEncoder().encode(data)) : data;
  let h = 0n;
  const len = Math.min(bytes.length, MAX_POS);
  for (let i = 0; i < len; i++) {
    h = (h ^ TABLE[i]![bytes[i]! & 0xff]!) & MASK64;
    hooks.onByte?.(i, bytes[i]! & 0xff, h);
  }
  // 把长度混入，避免 "ab" 和 "ab\0" 同 hash
  h = (h ^ TABLE[bytes.length % MAX_POS]![bytes.length & 0xff]!) & MASK64;
  hooks.onResult?.(h);
  return h;
}
