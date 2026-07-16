// 左视图v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'tree-left-view-2',
  categoryId: 'tree',
  title: { zh: '左视图v2', en: 'Left Side View v2' },
  summary: { zh: '每层最左节点。', en: 'Leftmost node of each level.' },
  description: {
    zh: '层序遍历，每层取第一个。',
    en: 'Level order, take first of each level. O(n).',
  },
  tags: ['tree', 'left-view', 'bfs'],
  complexity: { time: 'O(n)', space: 'O(w)' },
};
