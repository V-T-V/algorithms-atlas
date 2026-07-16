// 确定性线性时间选择 BFPRT · 实现

export interface DsHooks {
  onPivot?: (pivot: number) => void;
  onPartition?: (left: number, right: number, mid: number) => void;
  onRecurse?: (left: number, right: number, k: number) => void;
}

function _median5(arr: number[], a: number, b: number, c: number, d: number, e: number): number {
  const xs = [arr[a]!, arr[b]!, arr[c]!, arr[d]!, arr[e]!].sort((x, y) => x - y);
  return xs[2]!;
}

function partition(arr: number[], lo: number, hi: number, pivotVal: number): number {
  // 把 pivot 移到末尾
  let pivotIdx = lo;
  for (let i = lo; i <= hi; i++) {
    if (arr[i]! === pivotVal) {
      pivotIdx = i;
      break;
    }
  }
  const tmp = arr[pivotIdx]!;
  arr[pivotIdx] = arr[hi]!;
  arr[hi] = tmp;
  // Lomuto 划分
  let store = lo;
  for (let i = lo; i < hi; i++) {
    if (arr[i]! < pivotVal) {
      const t = arr[store]!;
      arr[store] = arr[i]!;
      arr[i] = t;
      store++;
    }
  }
  const t = arr[store]!;
  arr[store] = arr[hi]!;
  arr[hi] = t;
  return store;
}

/** 选第 k 小（0-based k）。返回值，不改原数组。 */
export function deterministicSelect(
  input: readonly number[],
  k: number,
  hooks: DsHooks = {},
): number {
  if (k < 0 || k >= input.length) throw new RangeError(`k=${k} 越界 [0,${input.length})`);
  const arr = [...input];

  const recurse = (lo: number, hi: number, kAbs: number): number => {
    hooks.onRecurse?.(lo, hi, kAbs);
    if (lo === hi) return arr[lo]!;
    // 中位数的中位数
    const medians: number[] = [];
    for (let i = lo; i <= hi; i += 5) {
      const subEnd = Math.min(i + 4, hi);
      const sub = arr.slice(i, subEnd + 1).sort((a, b) => a - b);
      medians.push(sub[Math.floor(sub.length / 2)]!);
    }
    const mom =
      medians.length === 1 ? medians[0]! : recurseMed(medians, Math.floor(medians.length / 2));
    hooks.onPivot?.(mom);
    const p = partition(arr, lo, hi, mom);
    hooks.onPartition?.(lo, hi, p);
    if (kAbs === p) return arr[p]!;
    if (kAbs < p) return recurse(lo, p - 1, kAbs);
    return recurse(p + 1, hi, kAbs);
  };

  const recurseMed = (vals: number[], kk: number): number => {
    const sorted = [...vals].sort((a, b) => a - b);
    return sorted[kk]!;
  };

  return recurse(0, arr.length - 1, k);
}
