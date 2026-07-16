// 桶洗牌 · 实现

export type Rng = () => number;
export function makeRng(seed: number): Rng {
  let s = seed >>> 0;
  return (): number => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

export interface BsHooks {
  onKey?: (index: number, key: number) => void;
  onPlace?: (index: number, position: number) => void;
}

/** 桶洗牌：给每个元素一个 [0,1) 随机键，分桶后串接。 */
export function bucketShuffle(n: number, rng: Rng, hooks: BsHooks = {}): number[] {
  const keyed = Array.from({ length: n }, (_, i) => ({ i, k: rng() }));
  for (const { i, k } of keyed) hooks.onKey?.(i, k);
  // 按键排序（稳定）
  keyed.sort((a, b) => a.k - b.k);
  const out = keyed.map((x, pos) => {
    hooks.onPlace?.(x.i, pos);
    return x.i;
  });
  return out;
}
