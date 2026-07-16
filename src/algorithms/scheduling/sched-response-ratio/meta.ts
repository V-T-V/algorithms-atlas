// 响应比计算 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'sched-response-ratio',
  categoryId: 'scheduling',
  title: { zh: '响应比计算', en: 'Response Ratio Calculator' },
  summary: {
    zh: '计算各进程在某时刻的响应比。',
    en: 'Compute response ratio of each process at a time.',
  },
  description: { zh: 'R = (wait + burst) / burst。', en: 'R = (wait+burst)/burst. O(n).' },
  tags: ['scheduling', 'metric'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
