// 种子扩展（多个独立子流）· 纯算法实现
import { splitMix64 } from '../rand-hash-mixer/impl.ts';

export interface SeedExtendHooks {
  onDerive?: (index: number, subSeed: bigint) => void;
  onResult?: (seeds: bigint[]) => void;
}

const MASK64 = (1n << 64n) - 1n;

export function extendSeeds(
  master: bigint,
  count: number,
  stride = 0x9e3779b97f4a7c15n,
  hooks: SeedExtendHooks = {},
): bigint[] {
  const base = splitMix64(master & MASK64);
  const seeds: bigint[] = [];
  for (let i = 0; i < count; i++) {
    const sub = splitMix64((base + BigInt(i) * stride) & MASK64);
    seeds.push(sub);
    hooks.onDerive?.(i, sub);
  }
  hooks.onResult?.(seeds);
  return seeds;
}

/** 给定子流种子生成 n 个伪随机数。 */
export function substream(master: bigint, index: number, n: number): bigint[] {
  const seeds = extendSeeds(master, index + 1);
  const state = seeds[index]!;
  const out: bigint[] = [];
  let s = state;
  for (let i = 0; i < n; i++) {
    s = splitMix64(s);
    out.push(s);
  }
  return out;
}
