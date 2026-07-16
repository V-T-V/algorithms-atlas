// Stone Game IV · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-stone-game-iv',
  categoryId: 'dp',
  title: { zh: '石子游戏 IV', en: 'Stone Game IV' },
  summary: {
    zh: '两人轮流取平方数个石子，取走最后一个者胜。',
    en: 'Two players remove a square number of stones; last mover wins.',
  },
  description: {
    zh: '石子游戏 IV：n 个石子，两人轮流移除「非零平方数」个（1,4,9,16,...），取走最后一个石子者胜，双方最优。dp[i] 表示剩 i 个石子时当前玩家是否必胜。dp[i] = OR_{k²<=i} !dp[i-k²]（存在一个平方数使对手进入必败态则当前必胜）。时间 O(n√n)。',
    en: 'Stone Game IV: n stones; players alternately remove a positive square number (1,4,9,...); last mover wins, both optimal. dp[i] = whether the current player wins with i stones. dp[i] = OR_{k²<=i} !dp[i-k²]. Time O(n√n).',
  },
  tags: ['dp', 'game-theory', 'stone-game', 'square'],
  complexity: { time: 'O(n√n)', space: 'O(n)' },
};
