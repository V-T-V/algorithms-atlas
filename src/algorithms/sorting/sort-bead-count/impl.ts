// 珠排序（计数实现）· 纯算法实现
export interface BeadCountHooks {
  onRow?: (row: number, count: number, arr: number[]) => void;
}

export function beadSortCount(arr: readonly number[], hooks: BeadCountHooks = {}): number[] {
  if (arr.length === 0) return [];
  const max = Math.max(...arr);
  if (max === 0) return [...arr];
  // poles[i] = 每个值贡献前 v 颗珠子，故 poles[i] = count(v >= i+1)
  const poles = new Array<number>(max).fill(0);
  for (const v of arr) for (let i = 0; i < v; i++) poles[i]!++;
  const out: number[] = [];
  for (let row = 0; row < max; row++) {
    hooks.onRow?.(row, poles[row]!, out);
    // 值恰好为 (row+1) 的个数 = poles[row] - poles[row+1]（poles[max] 视为 0）
    const cnt = poles[row]! - (row + 1 < max ? poles[row + 1]! : 0);
    for (let k = 0; k < cnt; k++) out.push(row + 1);
  }
  return out;
}
