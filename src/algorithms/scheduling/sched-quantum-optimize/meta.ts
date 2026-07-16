// 时间片优化 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'sched-quantum-optimize',
  categoryId: 'scheduling',
  title: { zh: '时间片优化', en: 'Quantum Size Optimization' },
  summary: {
    zh: '枚举量子大小找使平均等待最小的值。',
    en: 'Search quantum size minimizing avg wait.',
  },
  description: { zh: '枚举多个量子跑 RR。', en: 'Try multiple quantums. O(q * n*total).' },
  tags: ['scheduling', 'optimization'],
  complexity: { time: 'O(q * n*total)', space: 'O(n)' },
};
