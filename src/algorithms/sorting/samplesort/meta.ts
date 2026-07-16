// 采样排序 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'samplesort',
  categoryId: 'sorting',
  title: { zh: '采样排序', en: 'Samplesort' },
  summary: {
    zh: '采样排序：采样若干主元做 (k+1) 路划分，递归收尾。',
    en: 'Samplesort: sample pivots, partition into (k+1) buckets, recurse.',
  },
  description: {
    zh:
      '采样排序（Samplesort）是快速排序的多主元 / 多路推广，常用于并行与外部排序：' +
      '\n- 从输入中随机采样 s 个元素，排序后取等距的 (k−1) 个主元。' +
      '\n- 用这组主元把数组划成 k 个桶（每个桶内元素均处于相邻主元之间）。' +
      '\n- 对每个桶递归采样排序，桶足够小时用插入排序收尾。' +
      '\n- 主元选取更均匀，划分更平衡，平均 `O(n log n)`，常被并行实现用于均衡负载。',
    en:
      'Samplesort is a multi-pivot / multi-way generalization of quicksort, common in parallel and ' +
      'external sorting: ' +
      '\n- Sample s elements, sort them, pick (k−1) equally-spaced pivots. ' +
      '\n- Partition the array into k buckets using these pivots. ' +
      '\n- Recurse on each bucket; finish small buckets with insertion sort. ' +
      '\n- Pivots are more representative, so partitions are balanced. Average O(n log n); ' +
      'often parallelized for load balance.',
  },
  tags: ['sorting', 'divide-and-conquer', 'multi-pivot', 'parallel-friendly', 'unstable'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
