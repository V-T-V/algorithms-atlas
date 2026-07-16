// 滚动哈希（多基）· 实现
const MOD = 0x7fffffff;
const BASE = 257;

export interface RollingHashHooks {
  onInit?: (hash: number, windowSize: number) => void;
  onRoll?: (oldByte: number, newByte: number, hash: number, position: number) => void;
  onResult?: (hash: number) => void;
}

export function rollingHash(
  data: string | readonly number[],
  windowSize: number,
  hooks: RollingHashHooks = {},
): number {
  const bytes = typeof data === 'string' ? Array.from(new TextEncoder().encode(data)) : data;
  if (bytes.length < windowSize) return 0;
  let hash = 0;
  // base^(windowSize-1) mod MOD
  let highestPow = 1;
  for (let i = 0; i < windowSize - 1; i++) highestPow = (highestPow * BASE) & MOD;
  for (let i = 0; i < windowSize; i++) hash = (hash * BASE + (bytes[i]! & 0xff)) & MOD;
  hooks.onInit?.(hash, windowSize);
  for (let i = windowSize; i < bytes.length; i++) {
    const oldByte = bytes[i - windowSize]! & 0xff;
    const newByte = bytes[i]! & 0xff;
    hash = (((hash - oldByte * highestPow) & MOD) * BASE + newByte) & MOD;
    hooks.onRoll?.(oldByte, newByte, hash, i);
  }
  const result = hash >>> 0;
  hooks.onResult?.(result);
  return result;
}

// 验证：暴力重算
export function rollingHashBrute(
  data: string | readonly number[],
  windowSize: number,
  position: number,
): number {
  const bytes = typeof data === 'string' ? Array.from(new TextEncoder().encode(data)) : data;
  if (position + windowSize > bytes.length) return 0;
  let hash = 0;
  for (let i = 0; i < windowSize; i++) hash = (hash * BASE + (bytes[position + i]! & 0xff)) & MOD;
  return hash >>> 0;
}
