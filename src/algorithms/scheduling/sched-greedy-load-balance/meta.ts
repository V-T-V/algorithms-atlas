// LPT负载均衡 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'sched-greedy-load-balance',
  categoryId: 'scheduling',
  title: { zh: 'LPT负载均衡', en: 'LPT Load Balancing' },
  summary: {
    zh: '长作业优先分配到当前最闲的机器。',
    en: 'Assign longest job to least-loaded machine (LPT).',
  },
  description: {
    zh: '按 burst 降序，每次放最闲机器。',
    en: 'Sort desc, place on min-load. O(n log n).',
  },
  tags: ['scheduling', 'load-balance', 'lpt'],
  complexity: { time: 'O(n log n)', space: 'O(m)' },
};
