// 批处理顺序调度 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'sched-batch-sequential',
  categoryId: 'scheduling',
  title: { zh: '批处理顺序调度', en: 'Batch Sequential Scheduling' },
  summary: {
    zh: '按提交顺序无切换执行批处理作业。',
    en: 'Run batch jobs in submission order, no switches.',
  },
  description: { zh: '简单 FIFO，零切换。', en: 'Simple FIFO zero switch. O(n).' },
  tags: ['scheduling', 'batch'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
