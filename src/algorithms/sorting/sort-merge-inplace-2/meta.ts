// 归并排序（原地简化） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-merge-inplace-2',
  categoryId: 'sorting',
  title: { zh: '归并排序（原地简化）', en: 'Merge Sort (In-Place Simplified)' },
  summary: {
    zh: '原地归并的简化版：归并时用旋转把元素移到正确位置，避免辅助数组。',
    en: 'Simplified in-place merge using rotation to move elements during merge, avoiding an auxiliary array.',
  },
  description: {
    zh: '标准归并排序需 O(n) 辅助数组。原地归并排序尝试不用额外空间：归并两个相邻有序段 [lo,mid) 与 [mid,hi) 时，用「块旋转」把 mid 起的小于等于 lo 段尾的元素整体移到前面。本简化版用三次反转实现旋转，最坏 O(n^2) 但空间 O(1)（递归栈 O(log n)）。适合内存受限场景。稳定。',
    en: "Standard merge sort needs O(n) auxiliary space. In-place merge sort avoids it: when merging two adjacent sorted runs [lo,mid) and [mid,hi), it rotates blocks so the elements from mid that are <= the lo run's tail move to the front. This simplified version uses three reversals for rotation; worst case O(n^2) but space O(1) (recursion stack O(log n)). Good for memory-constrained settings. Stable.",
  },
  tags: ['sorting', 'comparison', 'stable', 'in-place', 'merge'],
  complexity: { time: 'O(n^2)', space: 'O(log n)' },
};
