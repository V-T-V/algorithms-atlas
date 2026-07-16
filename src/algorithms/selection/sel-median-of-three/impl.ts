// 三数取中位数 · 实现

export interface M3Result {
  median: number;
  index: number;
}

/** 返回 arr[lo], arr[mid], arr[hi] 的中位数及其索引。 */
export function medianOfThree(arr: readonly number[], lo: number, hi: number): M3Result {
  const mid = (lo + hi) >> 1;
  const a = { v: arr[lo]!, i: lo };
  const b = { v: arr[mid]!, i: mid };
  const c = { v: arr[hi]!, i: hi };
  const triple = [a, b, c].sort((x, y) => x.v - y.v);
  return { median: triple[1]!.v, index: triple[1]!.i };
}

/** 对整个数组取三数中位数。 */
export function medianOfThreeOfArray(arr: readonly number[]): M3Result {
  if (arr.length < 3) {
    const sorted = arr.map((v, i) => ({ v, i })).sort((x, y) => x.v - y.v);
    const m = sorted[Math.floor(sorted.length / 2)]!;
    return { median: m.v, index: m.i };
  }
  return medianOfThree(arr, 0, arr.length - 1);
}
