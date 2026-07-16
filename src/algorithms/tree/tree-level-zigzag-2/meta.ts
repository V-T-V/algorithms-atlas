// 锯齿层序v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'tree-level-zigzag-2',
  categoryId: 'tree',
  title: { zh: '锯齿层序v2', en: 'Zigzag Level Order v2' },
  summary: { zh: '层序遍历，奇数层反向。', en: 'Level order with odd levels reversed.' },
  description: { zh: '层序收集，每隔一层 reverse。', en: 'BFS, reverse odd levels. O(n).' },
  tags: ['tree', 'zigzag', 'bfs'],
  complexity: { time: 'O(n)', space: 'O(w)' },
};
