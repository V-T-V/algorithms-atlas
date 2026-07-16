// BLAKE2sp 简化 · 实现（8 路）
const MASK = (1n << 256n) - 1n;
function subHash(bytes: readonly number[], salt: bigint): bigint {
  let h = salt;
  for (let i = 0; i < bytes.length; i++) {
    h = (h * 0x100000001b3n + BigInt(bytes[i]!)) & MASK;
    h = ((h << 11n) | (h >> 245n)) & MASK;
  }
  return h;
}
export interface Blake2spHooks {
  onLane?: (laneIdx: number, partial: bigint) => void;
  onResult?: (hash: bigint) => void;
}
export function hashBlake2sp(data: string | readonly number[], hooks: Blake2spHooks = {}): bigint {
  const bytes = typeof data === 'string' ? Array.from(new TextEncoder().encode(data)) : data;
  const lanes: bigint[] = [];
  for (let lane = 0; lane < 8; lane++) {
    const slice = bytes.filter((_, i) => i % 8 === lane);
    const partial = subHash(slice, (BigInt(lane + 1) * 0x87c3fn) & MASK);
    lanes.push(partial);
    hooks.onLane?.(lane, partial);
  }
  let combined = 0n;
  for (const p of lanes) combined = (combined * 17n + p) & MASK;
  for (let r = 0; r < 4; r++)
    combined = ((combined ^ (combined >> 23n)) * 0xc4ceb9fe1a85ec53n) & MASK;
  hooks.onResult?.(combined);
  return combined;
}
