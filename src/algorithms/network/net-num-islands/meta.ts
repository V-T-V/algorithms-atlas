// 岛屿数量 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'net-num-islands',
  categoryId: 'network',
  title: { zh: '岛屿数量', en: 'Number of Islands' },
  summary: { zh: '网格中 1 连通块数量。', en: 'Count connected components of 1s in a grid.' },
  description: { zh: '对每个未访问的 1 做 DFS 沉岛。', en: 'DFS sink each unvisited 1. O(R*C).' },
  tags: ['network', 'grid', 'components'],
  complexity: { time: 'O(R*C)', space: 'O(R*C)' },
};
