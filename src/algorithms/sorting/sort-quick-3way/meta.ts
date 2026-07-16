// 快速排序（三路划分） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-quick-3way',
  categoryId: 'sorting',
  title: { zh: '快速排序（三路划分）', en: 'Quick Sort (3-Way Partition)' },
  summary: {
    zh: 'Dijkstra 三路划分：按小于/等于/大于 pivot 三段递归，高效处理大量重复键。',
    en: 'Dijkstra 3-way partition splits into <,=,> pivot segments; fast on many duplicate keys.',
  },
  description: {
    zh: '三路快速排序（3-Way Quick Sort / Dutch National Flag）由 Dijkstra 提出。普通快排对大量重复键退化，三路版在划分时把数组分成 [lo, lt) < pivot、[lt, gt] = pivot、(gt, hi] > pivot 三段，只对 < 和 > 两段递归，等于 pivot 的段直接定下来。对含大量重复元素的输入接近 O(n)。平均 O(n log n)，原地但递归栈 O(log n)。',
    en: '3-way quicksort (Dutch national flag), due to Dijkstra, partitions the array into < pivot, = pivot, > pivot and recurses only on the < and > segments, fixing the equal segment in place. This avoids the O(n^2) blowup of ordinary quicksort on many duplicate keys, approaching O(n) for heavily-duplicated input. Average O(n log n), in-place with O(log n) recursion.',
  },
  tags: ['sorting', 'comparison', 'in-place', 'divide-and-conquer', 'duplicates'],
  complexity: { time: 'O(n log n)', space: 'O(log n)' },
};
