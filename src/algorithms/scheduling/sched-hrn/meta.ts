// 最高响应比优先 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'sched-hrn',
  categoryId: 'scheduling',
  title: { zh: '最高响应比优先', en: 'Highest Response Ratio Next' },
  summary: {
    zh: '响应比 = (等待+burst)/burst，选最大。',
    en: 'Response ratio = (wait+burst)/burst, pick max.',
  },
  description: {
    zh: '非抢占，每步算响应比。',
    en: 'Non-preemptive, compute ratio each step. O(n^2).',
  },
  tags: ['scheduling', 'hrn'],
  complexity: { time: 'O(n^2)', space: 'O(n)' },
};
