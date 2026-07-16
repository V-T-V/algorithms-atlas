// 树的坡度v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'tree-tilt-2',
  categoryId: 'tree',
  title: { zh: '树的坡度v2', en: 'Binary Tree Tilt v2' },
  summary: {
    zh: '每个节点坡度=左右子树和之差的绝对值，求总坡度。',
    en: 'Tilt = |sum(left) - sum(right)| per node; sum all tilts.',
  },
  description: {
    zh: '后序递归同时返回子树和与累计坡度。',
    en: 'Post-order; return subtree sum, accumulate tilt. O(n).',
  },
  tags: ['tree', 'tilt', 'postorder'],
  complexity: { time: 'O(n)', space: 'O(h)' },
};
