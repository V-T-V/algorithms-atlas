// 弱堆排序（实现为 3-叉堆变体）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-weak-heap',
  categoryId: 'sorting',
  title: { zh: '三叉堆排序（弱堆变体）', en: 'Ternary Heap Sort (Weak-Heap Variant)' },
  summary: {
    zh: '用 3-叉完全堆（每个父节点有 3 个孩子）做堆排序，相比二叉堆深度更浅。',
    en: 'Heap sort over a 3-ary complete heap (three children per node), shallower than a binary heap.',
  },
  description: {
    zh: '本算法是堆排序的一种「弱堆」风格变体：使用 3-叉完全堆（d=3）而非标准二叉堆。每个节点 i 的三个孩子为 3i+1、3i+2、3i+3，父节点为 ⌊(i-1)/3⌋。三叉堆的树高比二叉堆降低约 log₃ n，下沉时每层比较次数增多（需在 3 个孩子中选最大）但层数更少，在某些缓存/比较开销结构下更优。不稳定，原地排序。',
    en: 'This is a "weak-heap style" variant of heap sort using a 3-ary complete heap (d=3) instead of the standard binary heap. Each node i has three children 3i+1, 3i+2, 3i+3, with parent ⌊(i-1)/3⌋. The 3-ary heap is shallower than a binary heap by a factor of log₃ n; each sift-down does more comparisons (picking the max of three children) but fewer levels, which can be advantageous under certain cache/comparison-cost profiles. Unstable, in-place.',
  },
  tags: ['sorting', 'heap', 'in-place', 'comparison', 'd-ary'],
  complexity: { time: 'O(n log n)', space: 'O(1)' },
};
