// 多路数字划分 · 实现
export interface MnpHooks {
  onPlace?: (num: number, group: number) => void;
  onConclude?: (groups: number[][], maxSum: number) => void;
}
export function multiwayNumber(
  nums: readonly number[],
  k: number,
  hooks: MnpHooks = {},
): { groups: number[][]; maxSum: number } {
  const order = [...nums].sort((a, b) => b - a);
  const sums = new Array<number>(k).fill(0);
  const groups: number[][] = Array.from({ length: k }, () => []);
  for (const x of order) {
    let gi = 0;
    for (let i = 1; i < k; i++) if (sums[i]! < sums[gi]!) gi = i;
    sums[gi]! += x;
    groups[gi]!.push(x);
    hooks.onPlace?.(x, gi);
  }
  hooks.onConclude?.(groups, Math.max(...sums));
  return { groups, maxSum: Math.max(...sums) };
}
