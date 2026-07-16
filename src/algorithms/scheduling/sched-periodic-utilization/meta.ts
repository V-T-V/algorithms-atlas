// 周期任务利用率检查 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'sched-periodic-utilization',
  categoryId: 'scheduling',
  title: { zh: '周期任务利用率检查', en: 'Periodic Utilization Bound' },
  summary: {
    zh: '检查周期任务集是否可调度（RMS 利用率上界）。',
    en: 'Check schedulability via RMS utilization bound.',
  },
  description: { zh: 'n 任务 RMS 上界 n(2^(1/n)-1)。', en: 'RMS bound n(2^(1/n)-1). O(n).' },
  tags: ['scheduling', 'real-time', 'rms'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
