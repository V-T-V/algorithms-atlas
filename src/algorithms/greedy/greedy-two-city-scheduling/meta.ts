// 两城调度 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'greedy-two-city-scheduling',
  categoryId: 'greedy',
  title: { zh: '两城调度', en: 'Two City Scheduling' },
  summary: {
    zh: '2n 人各去 A/B 两城，每城正好 n 人，最小化总费用。',
    en: 'Send 2n people to cities A/B (n each) minimizing total cost.',
  },
  description: {
    zh: '按 (costA - costB) 排序：差值小者去 A 更划算，前 n 去 A、后 n 去 B。',
    en: 'Sort by (costA - costB): those with small difference favor city A; first n to A, rest to B.',
  },
  tags: ['greedy', 'sorting'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
