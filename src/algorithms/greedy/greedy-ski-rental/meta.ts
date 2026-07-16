// 租雪板问题（Ski Rental Problem）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'greedy-ski-rental',
  categoryId: 'greedy',
  title: { zh: '租雪板问题', en: 'Ski Rental Problem' },
  summary: {
    zh: '每天租或买断，未知总天数，最优确定性策略租到价格等于买价。',
    en: 'Rent daily or buy once; unknown horizon; optimal deterministic strategy rents until cost equals buy price.',
  },
  description: {
    zh: '租雪板：租价 r/天，买价 b，未知滑多少天。最优确定性：租 b/r 天后买，竞争比 2；随机化可达 e/(e-1)。',
    en: 'Ski rental: rent r/day or buy b; unknown days. Optimal deterministic: rent b/r days then buy, ratio 2; randomized e/(e-1).',
  },
  tags: ['greedy', 'online-algorithm', 'competitive-ratio'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
