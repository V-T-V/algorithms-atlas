// Heap 算法生成全排列 · 实现

export interface PermHooks {
  onPermutation?: (perm: number[]) => void;
  onSwap?: (i: number, j: number, arr: number[]) => void;
}

/** Heap 算法递归版。 */
export function heapPermutations(nums: number[], hooks: PermHooks = {}): number[][] {
  const arr = [...nums];
  const result: number[][] = [];
  const n = arr.length;

  const swap = (i: number, j: number): void => {
    const tmp = arr[i]!;
    arr[i] = arr[j]!;
    arr[j] = tmp;
    hooks.onSwap?.(i, j, [...arr]);
  };

  const generate = (k: number): void => {
    if (k === 1) {
      result.push([...arr]);
      hooks.onPermutation?.([...arr]);
      return;
    }
    generate(k - 1);
    for (let i = 0; i < k - 1; i++) {
      if (k % 2 === 0) swap(i, k - 1);
      else swap(0, k - 1);
      generate(k - 1);
    }
  };

  if (n > 0) generate(n);
  else result.push([]);
  return result;
}

/** Heap 算法迭代版。 */
export function heapPermutationsIter(nums: number[], hooks: PermHooks = {}): number[][] {
  const arr = [...nums];
  const n = arr.length;
  const result: number[][] = [];
  if (n === 0) return [[]];
  const c = new Array(n).fill(0);
  result.push([...arr]);
  hooks.onPermutation?.([...arr]);
  let i = 1;
  while (i < n) {
    if (c[i]! < i) {
      const j = i % 2 === 0 ? 0 : c[i]!;
      const tmp = arr[j]!;
      arr[j] = arr[i]!;
      arr[i] = tmp;
      result.push([...arr]);
      hooks.onPermutation?.([...arr]);
      c[i]++;
      i = 1;
    } else {
      c[i] = 0;
      i++;
    }
  }
  return result;
}
