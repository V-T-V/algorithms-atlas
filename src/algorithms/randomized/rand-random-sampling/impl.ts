// 随机采样（无放回，Vitter R）· 实现

export type Rng = () => number;
export function makeRng(seed: number): Rng {
  let s = seed >>> 0;
  return (): number => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

export interface RsHooks {
  onInsert?: (index: number, slot: number) => void;
  onReplace?: (index: number, slot: number) => void;
}

/** 从 0..n-1 中无放回抽 k 个索引。 */
export function randomSample(n: number, k: number, rng: Rng, hooks: RsHooks = {}): number[] {
  if (k > n) throw new RangeError(`k=${k} > n=${n}`);
  const reservoir = Array.from({ length: k }, (_, i) => i);
  for (let i = 0; i < k; i++) hooks.onInsert?.(i, i);
  for (let i = k; i < n; i++) {
    const j = Math.floor(rng() * (i + 1)); // [0, i]
    if (j < k) {
      reservoir[j] = i;
      hooks.onReplace?.(i, j);
    }
  }
  return reservoir;
}
