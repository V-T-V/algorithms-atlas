// =============================================================================
// 二分插入排序变种（稳定）· 纯算法实现
// 用 bisectRight（第一个严格大于 key 的位置）定位，保证稳定性。
// =============================================================================
export interface BinaryInsertion2Hooks {
  onSearchStart?: (i: number, key: number) => void;
  onInsertPos?: (i: number, pos: number) => void;
  onShift?: (from: number, to: number, key: number) => void;
}

/** 在 a[lo..hi)（均含 lo，右开）中找第一个严格大于 key 的位置（bisectRight）。 */
function bisectRight(a: readonly number[], lo: number, hi: number, key: number): number {
  let l = lo;
  let r = hi;
  while (l < r) {
    const mid = (l + r) >> 1;
    if (a[mid]! <= key) l = mid + 1;
    else r = mid;
  }
  return l;
}

export function binaryInsertionSort2(
  arr: readonly number[],
  hooks: BinaryInsertion2Hooks = {},
): number[] {
  const a = [...arr];
  const n = a.length;
  if (n <= 1) return a;
  for (let i = 1; i < n; i++) {
    const key = a[i]!;
    hooks.onSearchStart?.(i, key);
    const pos = bisectRight(a, 0, i, key); // a[0..i) 已排好
    hooks.onInsertPos?.(i, pos);
    // 把 a[pos..i-1] 整体右移一格
    for (let j = i; j > pos; j--) {
      a[j] = a[j - 1]!;
    }
    if (i !== pos) hooks.onShift?.(pos, i, key);
    a[pos] = key;
  }
  return a;
}
