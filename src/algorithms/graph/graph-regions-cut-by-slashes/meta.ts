import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-regions-cut-by-slashes',
  categoryId: 'graph',
  title: { zh: '斜杠划分区域', en: 'Regions Cut By Slashes' },
  summary: {
    zh: '把每格放大成 3×3 像素，用并查集统计被斜杠切出的区域数。',
    en: 'Upscale each cell to 3×3 pixels and count regions via union-find.',
  },
  description: {
    zh: 'LeetCode 959。n×n 网格 grid，每格字符为空格、"/" 或 "\\"，这些斜杠把平面切成若干连通区域。把每个格子放大成 3×3 像素网格：把对应斜杠位置的像素设为 1（墙），其余 0；再用并查集或并查/BFS 统计 0 像素的连通分量数。时间 O(n²)，空间 O(n²)。',
    en: 'LeetCode 959. An n×n grid of space, "/", "\\" cuts the plane into regions. Upscale each cell to a 3×3 pixel grid marking slash pixels as walls; count connected components of 0-pixels via union-find. Time O(n²), space O(n²).',
  },
  tags: ['union-find', 'grid', 'upscale', 'leetcode'],
  complexity: { time: 'O(n²)', space: 'O(n²)' },
};
