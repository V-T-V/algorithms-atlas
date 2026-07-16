// Top-K 快选 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sel-top-k-quick',
  categoryId: 'selection',
  title: { zh: 'Top-K 快速选择', en: 'Top-K Quickselect' },
  summary: {
    zh: '用 quickselect 把前 k 大划到左侧，O(n) 期望，无需排序全部。',
    en: 'Use quickselect to partition the top-k to the left side; O(n) expected, no full sort.',
  },
  description: {
    zh: 'Top-K 快速选择：对数组做 quickselect 找到第 (n-k) 小（0-based）的位置，则左侧即为前 k 大（无序）。期望 O(n)，最坏 O(n^2)。',
    en: 'Top-K quickselect: run quickselect to place the (n-k)-th smallest (0-based); the left side then holds the top-k (unordered). Expected O(n), worst O(n^2).',
  },
  tags: ['selection', 'top-k', 'quickselect'],
  complexity: { time: 'O(n) 期望', space: 'O(log n)' },
};
