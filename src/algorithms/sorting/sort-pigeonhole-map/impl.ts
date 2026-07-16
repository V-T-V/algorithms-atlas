// 鸽巢排序（映射表）· 纯算法实现
export interface PigeonholeMapHooks {
  onPlace?: (hole: number, arr: number[]) => void;
}

export function pigeonholeSortMap(
  arr: readonly number[],
  hooks: PigeonholeMapHooks = {},
): number[] {
  if (arr.length === 0) return [];
  const mn = Math.min(...arr);
  const mx = Math.max(...arr);
  const range = mx - mn + 1;
  const holes: number[][] = Array.from({ length: range }, () => []);
  for (const v of arr) {
    holes[v - mn]!.push(v);
    hooks.onPlace?.(v - mn, holes[v - mn]!);
  }
  const out: number[] = [];
  for (const h of holes) out.push(...h);
  return out;
}
