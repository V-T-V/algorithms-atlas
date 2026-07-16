// 选择排序（朴素） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-selection-naive',
  categoryId: 'sorting',
  title: { zh: '选择排序（朴素）', en: 'Selection Sort (Naive)' },
  summary: {
    zh: '每轮在未排序段线性找最小，与段首交换。朴素版无任何优化。',
    en: 'Each round linearly find the min in the unsorted segment and swap it to the segment head; no optimizations.',
  },
  description: {
    zh: '选择排序朴素版：维护已排序前缀长度 i。每轮在 a[i..n) 中线性扫描找最小值下标 mi，把 a[i] 与 a[mi] 交换，i++。比较次数固定 n(n-1)/2 次（与输入无关），交换次数最多 n-1 次（最少，适合写入代价高的场景）。最坏/平均/最优均 O(n^2) 比较。不稳定（交换可能跨过相等元素），原地。',
    en: 'Naive selection sort: maintain the sorted prefix length i. Each round linearly scan a[i..n) for the minimum index mi, swap a[i] with a[mi], then i++. Comparison count is fixed at n(n-1)/2 (input-independent); swap count at most n-1 (minimal, good when writes are expensive). Worst/average/best all O(n^2) comparisons. Unstable (a swap can jump over equal elements), in-place.',
  },
  tags: ['sorting', 'comparison', 'in-place', 'selection', 'educational'],
  complexity: { time: 'O(n^2)', space: 'O(1)' },
};
