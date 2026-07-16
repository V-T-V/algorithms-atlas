// CPU利用率计算 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'sched-cpu-utilization',
  categoryId: 'scheduling',
  title: { zh: 'CPU利用率计算', en: 'CPU Utilization Calculation' },
  summary: {
    zh: '从调度结果计算 CPU 利用率。',
    en: 'Compute CPU utilization from schedule result.',
  },
  description: { zh: '利用率 = 总burst / 总时间。', en: 'util = sum(burst) / total. O(n).' },
  tags: ['scheduling', 'metric'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
