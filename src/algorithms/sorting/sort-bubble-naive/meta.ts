// 冒泡排序（朴素） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-bubble-naive',
  categoryId: 'sorting',
  title: { zh: '冒泡排序（朴素）', en: 'Bubble Sort (Naive)' },
  summary: {
    zh: '经典朴素冒泡：每趟相邻比较交换，无任何优化。',
    en: 'Classic naive bubble: compare-swap adjacent pairs each pass, no optimizations.',
  },
  description: {
    zh: '冒泡排序朴素版：重复扫描数组，每趟比较所有相邻对 a[i-1],a[i]，逆序则交换，把当前未排序段最大值冒泡到段尾。每趟后段尾位置固定，下一趟少比一个。无提前退出、无边界优化。最坏与平均 O(n^2)，最优（已有序）仍 O(n^2) 因无提前终止。稳定，原地。教学经典。',
    en: "Naive bubble sort: repeatedly scan the array, each pass comparing all adjacent pairs a[i-1],a[i] and swapping inversions, bubbling the current segment's max to its tail. After each pass the tail is fixed and the next pass compares one fewer. No early exit, no bound optimization. Worst and average O(n^2); even the best case stays O(n^2) without early termination. Stable, in-place. A teaching classic.",
  },
  tags: ['sorting', 'comparison', 'stable', 'in-place', 'bubble', 'educational'],
  complexity: { time: 'O(n^2)', space: 'O(1)' },
};
