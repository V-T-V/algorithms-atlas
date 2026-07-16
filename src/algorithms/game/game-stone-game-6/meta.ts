// 石子游戏 VI · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-stone-game-6',
  categoryId: 'game',
  title: { zh: '石子游戏 VI', en: 'Stone Game VI' },
  summary: {
    zh: '两人轮流取石子，各自按自己的价值计分，贪心按价值和排序。',
    en: 'Two players take turns picking stones scored by their own values; greedy by sum of both values.',
  },
  description: {
    zh: 'Alice 取 i 得 aliceValues[i]，Bob 取 i 得 bobValues[i]。最优策略：按 aliceValues[i]+bobValues[i] 降序轮流取。',
    en: 'Alice gains aliceValues[i], Bob gains bobValues[i]. Optimal: pick in descending order of aliceValues[i]+bobValues[i].',
  },
  tags: ['game', 'greedy'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
