// 指数平均估计SJF · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'sched-sjf-approx',
  categoryId: 'scheduling',
  title: { zh: '指数平均估计SJF', en: 'SJF with Exponential Averaging' },
  summary: {
    zh: '用历史估计下次 burst（指数平滑）。',
    en: 'Estimate next burst via exponential averaging.',
  },
  description: { zh: 'next = α*actual + (1-α)*prev。', en: 'next = α*actual + (1-α)*prev. O(n).' },
  tags: ['scheduling', 'estimation'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
