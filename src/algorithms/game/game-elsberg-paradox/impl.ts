// 埃尔斯伯格悖论 · 实现
// 计算两种赌局下各选项的最坏/最好期望收益。
export interface EllsbergHooks {
  onChoice?: (scenario: string, option: string, prob: number) => void;
}
export function ellsbergAnalysis(hooks: EllsbergHooks = {}): void {
  // 球数: red=30, black=b, yellow=y, b+y=60
  const n = 90,
    red = 30;
  for (let b = 0; b <= 60; b++) {
    const y = 60 - b;
    // 场景A: 抽红 vs 抽黑
    hooks.onChoice?.('A', 'red', red / n);
    hooks.onChoice?.('A', 'black', b / n);
    // 场景B: 抽红或黄 vs 抽黑或黄
    hooks.onChoice?.('B', 'red|yellow', (red + y) / n);
    hooks.onChoice?.('B', 'black|yellow', (b + y) / n);
    break; // 只展示一个 b 值
  }
}
