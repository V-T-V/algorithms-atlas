// =============================================================================
// 掷骰子 DP：m 面骰子掷 k 次，总点数 = n 的方案数。
// dp[i][s] = 前 i 次掷出总和 s 的方案数 = Σ_{f=1..m} dp[i-1][s-f]
// =============================================================================

export interface DiceRollInput {
  /** 骰子面数（点数 1..m）。 */
  faces: number;
  /** 掷骰次数。 */
  rolls: number;
  /** 目标总点数。 */
  target: number;
}

export interface DiceRollHooks {
  onCell?: (i: number, s: number, value: number) => void;
  onResult?: (ways: number) => void;
}

export interface DiceRollResult {
  ways: number;
  table: number[][];
}

export function diceRoll(input: DiceRollInput, hooks: DiceRollHooks = {}): DiceRollResult {
  const { faces, rolls, target } = input;
  if (rolls <= 0 || faces <= 0 || target < 0) {
    hooks.onResult?.(0);
    return { ways: 0, table: [] };
  }
  // 范围：i 次、最小点 i、最大点 i*m
  // s 上界取 target（超过 target 无意义）和 rolls*faces 中较小者，但为可视化取 target
  const maxS = Math.min(target, rolls * faces);
  // dp[i][s]：i 从 0..rolls，s 从 0..maxS
  const dp: number[][] = Array.from({ length: rolls + 1 }, () =>
    new Array<number>(maxS + 1).fill(0),
  );
  dp[0]![0] = 1;
  hooks.onCell?.(0, 0, 1);

  for (let i = 1; i <= rolls; i++) {
    for (let s = 1; s <= maxS; s++) {
      let sum = 0;
      for (let f = 1; f <= faces; f++) {
        if (s - f >= 0) sum += dp[i - 1]![s - f]!;
      }
      dp[i]![s] = sum;
      if (sum > 0) hooks.onCell?.(i, s, sum);
    }
  }

  const ways = dp[rolls]![target] ?? 0;
  hooks.onResult?.(ways);
  return { ways, table: dp };
}
