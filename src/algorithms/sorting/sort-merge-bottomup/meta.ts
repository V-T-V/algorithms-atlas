// 归并排序（自底向上迭代） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-merge-bottomup',
  categoryId: 'sorting',
  title: { zh: '归并排序（自底向上迭代）', en: 'Merge Sort (Bottom-Up Iterative)' },
  summary: {
    zh: '迭代地归并长度 1,2,4,8... 的子段，无需递归。',
    en: 'Iteratively merge runs of length 1,2,4,8... without recursion.',
  },
  description: {
    zh: '归并排序（Merge Sort）分治：自顶向下递归版先拆再合；自底向上迭代版直接从长度为 1 的子段开始，两两归并成长度 2，再 4、8... 直到整段有序。完全避免递归栈，空间 O(n)。时间 O(n log n) 稳定。适合链表或不希望递归的环境。',
    en: 'Merge sort divide-and-conquer: the top-down recursive version splits then merges; the bottom-up iterative version starts from length-1 runs and merges pairs into length 2, then 4, 8... until the whole array is ordered. It avoids the recursion stack entirely, using O(n) auxiliary space and O(n log n) time. Stable. Good for linked lists or recursion-free environments.',
  },
  tags: ['sorting', 'comparison', 'stable', 'divide-and-conquer', 'iterative'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
