// 蓄水池抽样 (Algorithm R) · 纯算法实现
export interface ReservoirHooks {
  onInit?: (reservoir: number[]) => void;
  onConsider?: (index: number, value: number, j: number, replace: boolean) => void;
  onResult?: (reservoir: number[]) => void;
}

function lcg(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1103515245 + 12345) >>> 0;
    return s / 0x100000000; // [0,1)
  };
}

export function reservoirSample(
  stream: Iterable<number>,
  k: number,
  rng: () => number = lcg(42),
  hooks: ReservoirHooks = {},
): number[] {
  if (k <= 0) return [];
  const reservoir: number[] = [];
  let i = 0;
  for (const x of stream) {
    if (i < k) {
      reservoir.push(x);
      if (i === k - 1) hooks.onInit?.([...reservoir]);
    } else {
      const j = Math.floor(rng() * (i + 1));
      if (j < k) {
        reservoir[j] = x;
        hooks.onConsider?.(i, x, j, true);
      } else {
        hooks.onConsider?.(i, x, j, false);
      }
    }
    i++;
  }
  // 若流长度 < k，截断
  hooks.onResult?.([...reservoir]);
  return reservoir;
}
