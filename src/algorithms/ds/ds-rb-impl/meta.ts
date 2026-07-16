import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ds-rb-impl',
  categoryId: 'ds',
  title: { zh: '红黑树实现', en: 'Red-Black Tree Implementation' },
  summary: {
    zh: '左倾红黑树（LLRB）插入与查找。',
    en: 'Left-Leaning Red-Black Tree (LLRB) insert and search.',
  },
  description: {
    zh: '左倾红黑树简化版：用红链表示 2-3 树的 3-节点；插入后修复左旋、右旋、变色。时间 O(log n)。',
    en: 'LLRB simplification: red link = 3-node; rebalance via rotateLeft, rotateRight, flipColors. O(log n).',
  },
  tags: ['ds', 'tree', 'rbtree', 'balanced'],
  complexity: { time: 'O(log n)', space: 'O(n)' },
};
