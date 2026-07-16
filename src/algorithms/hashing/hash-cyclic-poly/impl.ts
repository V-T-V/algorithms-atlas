// 循环多项式滚动哈希 · 实现
const MASK64 = (1n << 64n) - 1n;

function rotl64(x: bigint, r: number): bigint {
  const rr = BigInt(((r % 64) + 64) % 64);
  if (rr === 0n) return x;
  return ((x << rr) | (x >> (64n - rr))) & MASK64;
}

// 用 LCG 生成确定性 64 位随机表
const TABLE: bigint[] = (() => {
  const t: bigint[] = new Array(256);
  let s = 0x2545f4914f6cdd1dn;
  for (let i = 0; i < 256; i++) {
    s = (s * 6364136223846793005n + 1442695040888963407n) & MASK64;
    t[i] = s;
  }
  return t;
})();

export interface CyclicPolyHooks {
  onInit?: (hash: bigint, windowSize: number) => void;
  onRoll?: (oldByte: number, newByte: number, hash: bigint, position: number) => void;
  onResult?: (hash: bigint) => void;
}

export function cyclicPoly(
  data: string | readonly number[],
  windowSize: number,
  hooks: CyclicPolyHooks = {},
): bigint {
  const bytes = typeof data === 'string' ? Array.from(new TextEncoder().encode(data)) : data;
  if (bytes.length < windowSize || windowSize === 0) return 0n;
  let h = 0n;
  for (let i = 0; i < windowSize; i++) {
    h = (h ^ rotl64(TABLE[bytes[i]! & 0xff]!, i)) & MASK64;
  }
  hooks.onInit?.(h, windowSize);
  for (let i = windowSize; i < bytes.length; i++) {
    const oldByte = bytes[i - windowSize]! & 0xff;
    const newByte = bytes[i]! & 0xff;
    h =
      (rotl64(h, -1) ^ rotl64(TABLE[oldByte]!, -1) ^ rotl64(TABLE[newByte]!, windowSize - 1)) &
      MASK64;
    hooks.onRoll?.(oldByte, newByte, h, i);
  }
  const result = h & MASK64;
  hooks.onResult?.(result);
  return result;
}

export function cyclicPolyBrute(
  data: string | readonly number[],
  windowSize: number,
  position: number,
): bigint {
  const bytes = typeof data === 'string' ? Array.from(new TextEncoder().encode(data)) : data;
  if (position + windowSize > bytes.length) return 0n;
  let h = 0n;
  for (let i = 0; i < windowSize; i++) {
    h = (h ^ rotl64(TABLE[bytes[position + i]! & 0xff]!, i)) & MASK64;
  }
  return h;
}
