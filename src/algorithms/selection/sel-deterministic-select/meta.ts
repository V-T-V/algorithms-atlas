// 确定性选择（无随机）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sel-deterministic-select',
  categoryId: 'selection',
  title: { zh: '确定性线性时间选择', en: 'Deterministic Selection (BFPRT)' },
  summary: {
    zh: '中位数的中位数做 pivot，保证最坏 O(n) 选第 k 小。',
    en: 'Median-of-medians pivot guarantees worst-case O(n) selection of the k-th smallest.',
  },
  description: {
    zh: 'BFPRT（Blum-Floyd-Pratt-Rivest-Tarjan）选择：把数组按 5 个一组，取每组中位数，再递归取这些中位数的中位数作 pivot，确保两侧至多 7n/10。最坏情况 O(n)。',
    en: "BFPRT selection: split the array into groups of 5, take each group's median, recursively take the median of those medians as the pivot, ensuring each side has at most 7n/10 elements. Worst-case O(n).",
  },
  tags: ['selection', 'deterministic', 'median-of-medians', 'linear'],
  complexity: { time: 'O(n)', space: 'O(log n)' },
};
