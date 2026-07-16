// 交互式轮转 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'sched-interactive-rr',
  categoryId: 'scheduling',
  title: { zh: '交互式轮转', en: 'Interactive Round Robin' },
  summary: {
    zh: '短量子保持响应性，适用于交互系统。',
    en: 'Short quantum for responsiveness in interactive systems.',
  },
  description: { zh: '极短 RR 量子。', en: 'Very short RR quantum. O(n*total).' },
  tags: ['scheduling', 'round-robin', 'interactive'],
  complexity: { time: 'O(n*total)', space: 'O(n)' },
};
