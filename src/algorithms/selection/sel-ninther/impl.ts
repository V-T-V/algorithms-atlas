// Ninther 中位数 · 实现

export function median3(a: number, b: number, c: number): number {
  if ((a <= b && b <= c) || (c <= b && b <= a)) return b;
  if ((b <= a && a <= c) || (c <= a && a <= b)) return a;
  return c;
}

export interface NintherResult {
  value: number;
  index: number;
}

/** Ninther：把 [lo,hi] 分三段，各取 median-of-three，再取三者中位数。 */
export function ninther(arr: readonly number[], lo: number, hi: number): NintherResult {
  if (hi - lo < 9) {
    // 退化：取整体 median-of-three
    const mid = (lo + hi) >> 1;
    const v = median3(arr[lo]!, arr[mid]!, arr[hi]!);
    const idx = [lo, mid, hi].find((i) => arr[i] === v)!;
    return { value: v, index: idx };
  }
  const third = Math.floor((hi - lo) / 3);
  const seg1 = { lo, hi: lo + third };
  const seg2 = { lo: lo + third + 1, hi: lo + 2 * third };
  const seg3 = { lo: lo + 2 * third + 1, hi };

  const m1 = medianOfSegment(arr, seg1.lo, seg1.hi);
  const m2 = medianOfSegment(arr, seg2.lo, seg2.hi);
  const m3 = medianOfSegment(arr, seg3.lo, seg3.hi);

  const medians = [m1, m2, m3].sort((x, y) => x.value - y.value);
  return medians[1]!;
}

function medianOfSegment(arr: readonly number[], lo: number, hi: number): NintherResult {
  const mid = (lo + hi) >> 1;
  const triple = [
    { v: arr[lo]!, i: lo },
    { v: arr[mid]!, i: mid },
    { v: arr[hi]!, i: hi },
  ].sort((x, y) => x.v - y.v);
  return { value: triple[1]!.v, index: triple[1]!.i };
}

export function nintherOfArray(arr: readonly number[]): NintherResult {
  return ninther(arr, 0, arr.length - 1);
}
