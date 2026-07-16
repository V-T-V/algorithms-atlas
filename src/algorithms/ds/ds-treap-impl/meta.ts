import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ds-treap-impl',
  categoryId: 'ds',
  title: { zh: 'Treap 实现', en: 'Treap Implementation' },
  summary: {
    zh: '笛卡尔搜索树（键 = BST，优先级 = 堆）。',
    en: 'Cartesian BST+Heap: key as BST, priority as heap.',
  },
  description: {
    zh: '插入时随机赋优先级，向上回溯用旋转维护堆性质。期望 O(log n)。',
    en: 'Insert with random priority; rotate upward to maintain heap property. Expected O(log n).',
  },
  tags: ['ds', 'tree', 'treap', 'randomized'],
  complexity: { time: 'O(log n) 期望', space: 'O(n)' },
};
