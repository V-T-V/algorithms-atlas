// 等待时间计算 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'sched-wait-time',
  categoryId: 'scheduling',
  title: { zh: '等待时间计算', en: 'Waiting Time Calculator' },
  summary: {
    zh: '从周转和 burst 算等待时间。',
    en: 'Compute wait time from turnaround and burst.',
  },
  description: { zh: 'wait = TAT - burst。', en: 'wait = TAT - burst. O(n).' },
  tags: ['scheduling', 'metric'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
