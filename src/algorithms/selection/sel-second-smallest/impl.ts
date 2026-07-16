// 第二小（锦标赛法）· 实现

export interface SsResult {
  min: number;
  secondMin: number;
  comparisons: number;
}

export function secondSmallest(arr: readonly number[]): SsResult {
  if (arr.length < 2) throw new Error('至少需 2 个元素');
  // 构建锦标赛树：每轮两两比较，胜者（更小）晋级
  let level: Array<{ value: number; losers: number[] }> = arr.map((v) => ({
    value: v,
    losers: [],
  }));
  let comparisons = 0;
  while (level.length > 1) {
    const next: Array<{ value: number; losers: number[] }> = [];
    for (let i = 0; i < level.length; i += 2) {
      if (i + 1 < level.length) {
        comparisons++;
        const a = level[i]!;
        const b = level[i + 1]!;
        if (a.value <= b.value) {
          next.push({ value: a.value, losers: [...a.losers, b.value] });
        } else {
          next.push({ value: b.value, losers: [...b.losers, a.value] });
        }
      } else {
        next.push(level[i]!);
      }
    }
    level = next;
  }
  const winner = level[0]!;
  // 第二小在 winner.losers 中
  let secondMin = Infinity;
  for (const l of winner.losers) {
    comparisons++;
    if (l < secondMin) secondMin = l;
  }
  return { min: winner.value, secondMin, comparisons };
}
