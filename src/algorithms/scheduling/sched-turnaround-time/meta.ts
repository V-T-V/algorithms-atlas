// 周转时间计算 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'sched-turnaround-time',
  categoryId: 'scheduling',
  title: { zh: '周转时间计算', en: 'Turnaround Time Calculator' },
  summary: {
    zh: '从完成时间和到达时间算周转。',
    en: 'Compute turnaround from finish and arrival.',
  },
  description: { zh: 'TAT = finish - arrival。', en: 'TAT = finish - arrival. O(n).' },
  tags: ['scheduling', 'metric'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
