// =============================================================================
// Nim 堆游戏（限取）· 纯算法实现
// 每堆每次取 [1, maxTake] 颗，取最后一颗者胜。等价于 Bash 博弈的多堆推广：
// 归一化后总和 S = Σ (pile[i] mod (maxTake+1))，若 S 不为 0 先手必胜。
// =============================================================================
export interface GameNimHeapHooks {
  onNormalize?: (norm: number[]) => void;
  onSum?: (sum: number) => void;
  onConclude?: (firstWins: boolean) => void;
}

export function gameNimHeap(
  piles: readonly number[],
  maxTake: number,
  hooks: GameNimHeapHooks = {},
): boolean {
  const k = maxTake + 1;
  const norm = piles.map((p) => p % k);
  hooks.onNormalize?.(norm);
  const sum = norm.reduce((a, b) => a + b, 0);
  hooks.onSum?.(sum);
  // 取石子规则：每次可从任一堆取，但总取量受各堆约束。这里采用"取光制胜"，
  // 当所有归一化堆之和 (mod (maxTake+1)) 不为 0 时先手必胜（Nim-sum 类比）。
  let nimSum = 0;
  for (const v of norm) nimSum ^= v;
  // 简化判定：当 maxTake=1 时退化为 Nim，用异或和；否则用总和 mod (k)
  const firstWins = maxTake === 1 ? nimSum !== 0 : sum % k !== 0;
  hooks.onConclude?.(firstWins);
  return firstWins;
}
