// 猜硬币 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-matching-penny',
  categoryId: 'game',
  title: { zh: '猜硬币（Matching Pennies）', en: 'Matching Pennies' },
  summary: {
    zh: '经典 2×2 零和博弈：双方亮硬币，相同行赢、不同列赢，无纯策略纳什均衡。',
    en: 'Classic 2x2 zero-sum: both show a coin; row wins if matching, column if not. No pure Nash equilibrium.',
  },
  description: {
    zh: '行玩家希望双方相同（+1），列玩家希望不同（+1）。最优解为各以 1/2 概率混合。',
    en: 'Row wants matching (+1), column wants different (+1). Optimal: each mixes 1/2. Pure Nash: none.',
  },
  tags: ['game', 'game-theory', 'matrix', 'zero-sum'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
