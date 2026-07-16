// 堆排序（四叉堆） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-heap-4ary',
  categoryId: 'sorting',
  title: { zh: '堆排序（四叉堆）', en: 'Heap Sort (4-ary Heap)' },
  summary: {
    zh: '用 4-叉完全堆做堆排序，每节点 4 个孩子，深度更浅。',
    en: 'Heap sort over a 4-ary complete heap (four children per node), shallower depth.',
  },
  description: {
    zh: '四叉堆排序使用 d=4 的 d-叉完全堆：节点 i 的 4 个孩子为 4i+1..4i+4，父为 floor((i-1)/4)。相比二叉堆深度降低约 log_4 n，下沉时每层比较次数增多（在 4 个孩子中选最大）但层数更少。整体仍 O(n log n) 比较次数，但常数与缓存行为不同。不稳定，原地。',
    en: '4-ary heap sort uses a d-ary complete heap with d=4: node i has four children 4i+1..4i+4 and parent floor((i-1)/4). Depth is reduced by about log_4 n versus a binary heap; each sift-down compares more (picking the max of four children) but over fewer levels. Still O(n log n) overall with different constants and cache behavior. Unstable, in-place.',
  },
  tags: ['sorting', 'heap', 'in-place', 'comparison', 'd-ary'],
  complexity: { time: 'O(n log n)', space: 'O(1)' },
};
