// 堆排序（三叉带构建） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-heap-ternary',
  categoryId: 'sorting',
  title: { zh: '堆排序（三叉带构建）', en: 'Heap Sort (Ternary, Explicit Build)' },
  summary: {
    zh: '显式构建三叉大顶堆，再反复取堆顶到末尾。',
    en: 'Explicitly build a ternary max-heap, then repeatedly extract the root to the tail.',
  },
  description: {
    zh: '三叉堆排序（d=3）显式版：阶段一从最后一个非叶子节点 floor((n-1)/3) 起向上逐个下沉，构建大顶三叉堆；阶段二反复交换堆顶（最大）与当前段尾，段长减一，对堆顶下沉恢复堆序。每个节点 3 个孩子，深度 log_3 n。整体 O(n log n)，不稳定，原地。与已有的弱堆变体互补，本版强调构建与提取两阶段。',
    en: 'Explicit ternary heap sort (d=3): phase one sifts up from the last non-leaf floor((n-1)/3) to build a max ternary heap; phase two repeatedly swaps the root (max) with the current tail, shrinks the segment, and sifts the root down to restore heap order. Three children per node, depth log_3 n. Overall O(n log n), unstable, in-place. Complements the existing weak-heap variant; this version emphasizes the build-then-extract two phases.',
  },
  tags: ['sorting', 'heap', 'in-place', 'comparison', 'd-ary'],
  complexity: { time: 'O(n log n)', space: 'O(1)' },
};
