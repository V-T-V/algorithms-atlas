// 对称二叉树v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'tree-symmetric-2',
  categoryId: 'tree',
  title: { zh: '对称二叉树v2', en: 'Symmetric Tree v2' },
  summary: { zh: '判断二叉树是否镜像对称。', en: 'Check if a binary tree is a mirror of itself.' },
  description: {
    zh: '递归比较左右子树是否互为镜像：left.left vs right.right。',
    en: 'Recurse: isMirror(left, right). O(n).',
  },
  tags: ['tree', 'symmetric'],
  complexity: { time: 'O(n)', space: 'O(h)' },
};
