// 随机化快速排序 · 实现

export type Rng = () => number;

export function makeRng(seed: number): Rng {
  let s = seed >>> 0;
  return (): number => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

export interface RqHooks {
  onPivot?: (lo: number, hi: number, pivotIdx: number) => void;
  onCompare?: (i: number, j: number) => void;
  onSwap?: (i: number, j: number) => void;
  onSegment?: (lo: number, hi: number) => void;
}

export function randomizedQuicksort(arr: number[], rng: Rng, hooks: RqHooks = {}): number[] {
  const a = [...arr];
  const partition = (lo: number, hi: number): number => {
    // 随机选 pivot 并换到 hi
    const pIdx = lo + Math.floor(rng() * (hi - lo + 1));
    hooks.onPivot?.(lo, hi, pIdx);
    const tmp = a[pIdx]!;
    a[pIdx] = a[hi]!;
    a[hi] = tmp;
    const pivot = a[hi]!;
    let i = lo;
    for (let j = lo; j < hi; j++) {
      hooks.onCompare?.(j, hi);
      if (a[j]! < pivot) {
        if (i !== j) {
          const t = a[i]!;
          a[i] = a[j]!;
          a[j] = t;
          hooks.onSwap?.(i, j);
        }
        i++;
      }
    }
    const t = a[i]!;
    a[i] = a[hi]!;
    a[hi] = t;
    hooks.onSwap?.(i, hi);
    return i;
  };

  const sort = (lo: number, hi: number): void => {
    if (lo >= hi) return;
    hooks.onSegment?.(lo, hi);
    const p = partition(lo, hi);
    sort(lo, p - 1);
    sort(p + 1, hi);
  };

  sort(0, a.length - 1);
  return a;
}
