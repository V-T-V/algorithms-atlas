// 快速选择（第 k 小） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-quickselect',
  categoryId: 'searching',
  title: { zh: '快速选择（第 k 小）', en: 'Quickselect' },
  summary: {
    zh: '类快排的分区法，平均 O(n) 找第 k 小元素。',
    en: 'Quicksort-style partitioning to find the k-th smallest in average O(n).',
  },
  description: {
    zh: '快速选择（Quickselect）是快速排序的选择版：选一个 pivot 分区，若 pivot 最终位置恰为 k-1 则返回；若 k-1 在左段递归左段，否则递归右段。每轮把搜索范围缩小，平均 O(n)，最坏 O(n^2)（可用随机 pivot 缓解）。原地，不稳定。Hoare 选择算法。',
    en: "Quickselect is the selection version of quicksort: pick a pivot, partition; if the pivot's final position is exactly k-1 return it; if k-1 is in the left segment recurse left, else right. Each round shrinks the search range, average O(n), worst O(n^2) (mitigated by a random pivot). In-place, unstable. Hoare's selection algorithm.",
  },
  tags: ['searching', 'quickselect', 'partition', 'order-statistic'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
