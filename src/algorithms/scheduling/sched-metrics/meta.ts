// 调度指标计算 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'sched-metrics',
  categoryId: 'scheduling',
  title: { zh: '调度指标计算', en: 'Scheduling Metrics' },
  summary: {
    zh: '从甘特段计算等待/周转/响应时间。',
    en: 'Compute wait/turnaround/response from Gantt segments.',
  },
  description: { zh: '按段汇总每进程指标。', en: 'Aggregate per-process metrics. O(n*k).' },
  tags: ['scheduling', 'metric'],
  complexity: { time: 'O(n*k)', space: 'O(n)' },
};
