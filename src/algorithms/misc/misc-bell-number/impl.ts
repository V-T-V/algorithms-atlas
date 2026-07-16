// 贝尔数 · 实现
export interface BnHooks {
  onRow?: (row: number[]) => void;
  onConclude?: (bell: number) => void;
}
export function bellNumber(n: number, hooks: BnHooks = {}): number {
  const tri: number[][] = [[1]];
  for (let i = 1; i <= n; i++) {
    const row = new Array<number>(i + 1);
    row[0] = tri[i - 1]![tri[i - 1]!.length - 1]!;
    for (let j = 1; j <= i; j++) row[j] = row[j - 1]! + tri[i - 1]![j - 1]!;
    tri.push(row);
    hooks.onRow?.(row);
  }
  const bell = tri[n]![0]!;
  hooks.onConclude?.(bell);
  return bell;
}
