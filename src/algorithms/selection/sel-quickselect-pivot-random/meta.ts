// 随机 pivot 快速选择（Random-Pivot Quickselect）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sel-quickselect-pivot-random',
  categoryId: 'selection',
  title: { zh: '随机 pivot 快速选择', en: 'Random-Pivot Quickselect' },
  summary: {
    zh: 'Quickselect：随机选 pivot，期望 O(n)。',
    en: 'Quickselect: random pivot, expected O(n).',
  },
  description: {
    zh: 'Quickselect（Hoare）每次随机选 pivot 划分数组，递归到包含第 k 小的一侧。期望 O(n)，最坏 O(n²)。',
    en: 'Quickselect (Hoare) picks a random pivot, partitions, and recurses into the side containing the k-th smallest. Expected O(n), worst O(n²).',
  },
  tags: ['selection', 'quickselect', 'randomized', 'expected-linear'],
  complexity: { time: 'O(n) expected', space: 'O(log n)' },
};
