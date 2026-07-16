// Introselect v2（Introselect v2）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sel-introselect-full-2',
  categoryId: 'selection',
  title: { zh: 'Introselect v2', en: 'Introselect v2' },
  summary: {
    zh: 'Introselect：随机快选 + 中位数中位数回退，最坏 O(n)。',
    en: 'Introselect: random quickselect with median-of-medians fallback; worst-case O(n).',
  },
  description: {
    zh: 'Introselect（Musser）：先用随机快速选择；递归深度超过阈值后切换到中位数中位数 pivot（BFPRT），保证最坏 O(n)。',
    en: 'Introselect (Musser): start with random quickselect; once recursion depth exceeds a threshold, switch to median-of-medians (BFPRT) pivot, guaranteeing worst-case O(n).',
  },
  tags: ['selection', 'quickselect', 'introselect', 'hybrid', 'worst-case-linear'],
  complexity: { time: 'O(n)', space: 'O(log n)' },
};
