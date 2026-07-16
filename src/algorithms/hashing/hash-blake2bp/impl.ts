// BLAKE2bp 简化 · 实现（4 路并行子哈希）
const MASK = (1n << 256n) - 1n;
function subHash(bytes: readonly number[], salt: bigint): bigint {
  let h = salt;
  for (let i = 0; i < bytes.length; i++) {
    h = (h * 0x100000001b3n + BigInt(bytes[i]!)) & MASK;
    h = ((h << 13n) | (h >> 243n)) & MASK;
  }
  return h;
}
export interface Blake2bpHooks {
  onLane?: (laneIdx: number, partial: bigint) => void;
  onResult?: (hash: bigint) => void;
}
export function hashBlake2bp(data: string | readonly number[], hooks: Blake2bpHooks = {}): bigint {
  const bytes = typeof data === 'string' ? Array.from(new TextEncoder().encode(data)) : data;
  const lanes: bigint[] = [];
  for (let lane = 0; lane < 4; lane++) {
    const slice = bytes.filter((_, i) => i % 4 === lane);
    const partial = subHash(slice, (BigInt(lane + 1) * 0x9e3779b97f4a7c15n) & MASK);
    lanes.push(partial);
    hooks.onLane?.(lane, partial);
  }
  let combined = 0n;
  for (const p of lanes) combined = (combined * 31n + p) & MASK;
  for (let r = 0; r < 3; r++)
    combined = ((combined ^ (combined >> 17n)) * 0xff51afd7ed558ccdn) & MASK;
  hooks.onResult?.(combined);
  return combined;
}
