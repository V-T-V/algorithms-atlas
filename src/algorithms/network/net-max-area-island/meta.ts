// 最大岛屿面积 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'net-max-area-island',
  categoryId: 'network',
  title: { zh: '最大岛屿面积', en: 'Max Area of Island' },
  summary: { zh: '网格中 1 连通块的最大面积。', en: 'Maximum area of connected 1s in a grid.' },
  description: { zh: 'DFS 计算每个岛面积取最大。', en: 'DFS area per island, take max. O(R*C).' },
  tags: ['network', 'grid', 'area'],
  complexity: { time: 'O(R*C)', space: 'O(R*C)' },
};
