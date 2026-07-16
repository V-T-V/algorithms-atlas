// 平滑排序（Leonardo 堆） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-smooth',
  categoryId: 'sorting',
  title: { zh: '平滑排序（Leonardo 堆）', en: 'Smooth Sort (Leonardo Heaps)' },
  summary: {
    zh: '用 Leonardo 数列大小的堆组成森林，已有序时接近 O(n)。',
    en: 'A forest of heaps sized by Leonardo numbers; near O(n) when already sorted.',
  },
  description: {
    zh: '平滑排序（Smooth Sort）是堆排序的变体，最坏 O(n log n)，但对已有序输入可降到 O(n)。它维护一组由 Leonardo 数 L(k)=L(k-1)+L(k-2)+1 定义大小的堆（森林），根有序。元素出入时调整森林结构。本实现为简化教学版（标准堆排序 + 已有序检测），展示自适应思想。不稳定，原地。',
    en: 'Smooth sort is a heap-sort variant with worst case O(n log n) but O(n) on already-sorted input. It maintains a forest of heaps whose sizes follow the Leonardo numbers L(k)=L(k-1)+L(k-2)+1, with ordered roots. Elements are inserted/removed while adjusting the forest. This is a simplified teaching version (standard heap sort + sorted detection) illustrating the adaptive idea. Unstable, in-place.',
  },
  tags: ['sorting', 'comparison', 'in-place', 'heap', 'adaptive'],
  complexity: { time: 'O(n log n)', space: 'O(1)' },
};
