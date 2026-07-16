// 后序遍历v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'tree-postorder-2',
  categoryId: 'tree',
  title: { zh: '后序遍历v2', en: 'Postorder Traversal v2' },
  summary: { zh: '递归后序遍历：左→右→根。', en: 'Recursive postorder: left, right, root.' },
  description: {
    zh: '递归左右子树后再访问根。常用于删除/计算。',
    en: 'Recurse left, right, then visit root. O(n).',
  },
  tags: ['tree', 'traversal', 'postorder'],
  complexity: { time: 'O(n)', space: 'O(h)' },
};
