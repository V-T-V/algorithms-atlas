// 二分插入排序 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-binary-insert-2',
  categoryId: 'sorting',
  title: { zh: '二分插入排序', en: 'Binary Insertion Sort' },
  summary: {
    zh: '用二分查找定位插入点，再整体后移；减少比较次数到 O(n log n)。',
    en: 'Binary-search the insertion point then shift; cuts comparisons to O(n log n).',
  },
  description: {
    zh: '插入排序的内层循环可用二分查找优化：对每个待插入元素 v，在已排序前缀 a[0..i) 中用二分查找找到第一个 >= v 的位置 pos，然后把 a[pos..i) 整体后移一位，把 v 放到 pos。比较次数降为 O(n log n)，但移动次数仍 O(n^2)（后移），所以整体仍 O(n^2)，适合比较代价高的场景。稳定，原地。',
    en: 'The inner loop of insertion sort can be optimized with binary search: for each element v, binary-search the first position pos >= v in the sorted prefix a[0..i), shift a[pos..i) right by one, then place v at pos. Comparisons drop to O(n log n) but moves remain O(n^2), so the whole is still O(n^2); useful when comparisons are expensive. Stable, in-place.',
  },
  tags: ['sorting', 'comparison', 'stable', 'in-place', 'binary-search'],
  complexity: { time: 'O(n^2)', space: 'O(1)' },
};
