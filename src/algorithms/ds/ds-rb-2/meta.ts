import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ds-rb-2',
  categoryId: 'ds',
  title: { zh: '红黑树（左倾）', en: 'Left-Leaning Red-Black Tree' },
  summary: {
    zh: '左倾红黑树（LLRB），插入与删除保持近似平衡，操作 O(log n)。',
    en: 'Left-leaning red-black tree (LLRB); insertions keep near-balance, O(log n) ops.',
  },
  description: {
    zh: 'Sedgewick 的简化版红黑树：红链接只能左倾，每个节点到叶的黑色链接数相同。插入后通过 rotateLeft/rotateRight/flipColors 修复。',
    en: 'Sedgewick LLRB: red links lean left only; every root-to-null path has equal black count. Fixed via rotations and color flips.',
  },
  tags: ['ds', 'red-black-tree', 'balanced-tree'],
  complexity: { time: 'O(log n)', space: 'O(log n)' },
};
