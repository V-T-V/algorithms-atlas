// =============================================================================
// 银币游戏 · 纯算法实现
// positions: 硬币所在格子（升序）。可左移、不可越过其它硬币。
// 等价 Nim：第 1,3,5,... 个间隔（从最左硬币到第 1 枚、第 2 到第 3 枚…）异或和。
// =============================================================================
export interface GameSilverDollarHooks {
  onGap?: (index: number, gap: number) => void;
  onXor?: (xorSum: number) => void;
  onConclude?: (firstWins: boolean) => void;
}

export function gameSilverDollar(
  positions: readonly number[],
  hooks: GameSilverDollarHooks = {},
): boolean {
  const sorted = [...positions].sort((a, b) => a - b);
  const n = sorted.length;
  // 计算从位置 0 开始的间隔（第 i 枚硬币左侧可用空格）
  const gaps: number[] = [];
  let prev = -1; // 想象第 0 枚在 -1
  for (let i = 0; i < n; i++) {
    // 间隔 = sorted[i] - sorted[i-1] - 1 （可移动的空格数）
    const gap = sorted[i]! - (i === 0 ? 0 : sorted[i - 1]! + 1);
    gaps.push(gap);
    prev = sorted[i]!;
  }
  void prev;
  // Bogus Nim：从右数，两两配对的间隔异或（倒数第1枚与第2枚间隔、第3与第4…）
  let xorSum = 0;
  // 从最右开始两两分组
  for (let i = n - 1; i - 1 >= 0; i -= 2) {
    const g = gaps[i]! ^ gaps[i - 1]!;
    xorSum ^= g;
    hooks.onGap?.(i, g);
  }
  // 若硬币数为奇数，最左那枚单独贡献其间隔
  if (n % 2 === 1) {
    xorSum ^= gaps[0]!;
    hooks.onGap?.(0, gaps[0]!);
  }
  hooks.onXor?.(xorSum);
  const firstWins = xorSum !== 0;
  hooks.onConclude?.(firstWins);
  return firstWins;
}
