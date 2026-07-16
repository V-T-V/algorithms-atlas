// Spectral 简化 · 实现
const MASK = (1n << 256n) - 1n;
export interface SpectralHooks {
  onOctet?: (i: number, byte: number) => void;
  onResult?: (hash: bigint) => void;
}
export function hashSpectral(data: string | readonly number[], hooks: SpectralHooks = {}): bigint {
  const bytes = typeof data === 'string' ? Array.from(new TextEncoder().encode(data)) : data;
  let lo = 0n;
  let hi = 0n;
  for (let i = 0; i < bytes.length; i++) {
    lo = (lo * 31n + BigInt(bytes[i]!)) & MASK;
    hi = (hi ^ (BigInt(bytes[i]!) << BigInt((i * 7) % 256))) & MASK;
    hooks.onOctet?.(i, bytes[i]!);
  }
  // 频谱式混合：交叉 XOR
  for (let r = 0; r < 5; r++) {
    const t = lo;
    lo = (hi ^ ((lo * 0x9e3779b97f4a7c15n) & MASK)) & MASK;
    hi = (t ^ ((hi + 0xbb67ae8584caa73bn) & MASK)) & MASK;
  }
  const h = (lo ^ hi) & MASK;
  hooks.onResult?.(h);
  return h;
}
