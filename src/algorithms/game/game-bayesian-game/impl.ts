// 贝叶斯博弈 · 实现
// 简化：玩家1 有 2 个类型（strong/weak），先验 p；玩家2 类型固定。
// 给定玩家2 的固定策略 a2，求玩家1 各类型的最佳响应及其期望收益。
export interface BayesianHooks {
  onBestResponse?: (type1: number, bestAction: number, expectedPayoff: number) => void;
  onConclude?: (totalExpected: number) => void;
}
export interface BayesianResult {
  bestActions: number[]; // 每个类型玩家1的最佳动作
  expectedPayoffs: number[]; // 各类型下的期望收益
  totalExpected: number;
}
// payoff1[type1][a1][a2]: 玩家1 收益
export function gameBayesianGame(
  payoff1: ReadonlyArray<ReadonlyArray<readonly number[]>>, // [type1][a1][a2]
  prior1: readonly number[], // 玩家1 各类型概率
  a2: number, // 玩家2 的固定动作
  hooks: BayesianHooks = {},
): BayesianResult {
  const nTypes = payoff1.length;
  const nActions = payoff1[0]!.length;
  const bestActions: number[] = [];
  const expectedPayoffs: number[] = [];
  let totalExpected = 0;
  for (let t = 0; t < nTypes; t++) {
    let bestA = 0;
    let bestU = -Infinity;
    for (let a = 0; a < nActions; a++) {
      const u = payoff1[t]![a]![a2]!;
      if (u > bestU) {
        bestU = u;
        bestA = a;
      }
    }
    bestActions.push(bestA);
    expectedPayoffs.push(bestU);
    totalExpected += prior1[t]! * bestU;
    hooks.onBestResponse?.(t, bestA, bestU);
  }
  hooks.onConclude?.(totalExpected);
  return { bestActions, expectedPayoffs, totalExpected };
}
