// 右视图v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'tree-right-view-2',
  categoryId: 'tree',
  title: { zh: '右视图v2', en: 'Right Side View v2' },
  summary: {
    zh: '从右侧看二叉树能看到的节点（每层最右）。',
    en: 'Nodes visible from the right (rightmost of each level).',
  },
  description: {
    zh: '层序遍历，每层取最后一个。',
    en: 'Level order, take last of each level. O(n).',
  },
  tags: ['tree', 'right-view', 'bfs'],
  complexity: { time: 'O(n)', space: 'O(w)' },
};
