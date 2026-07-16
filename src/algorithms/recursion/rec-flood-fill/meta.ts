// 泛洪填充（DFS）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rec-flood-fill',
  categoryId: 'recursion',
  title: { zh: '泛洪填充（DFS）', en: 'Flood Fill (DFS)' },
  summary: {
    zh: '从起点 DFS 四向扩展，把连通的同色区域改为新颜色。',
    en: 'DFS from a start point across 4 neighbors to recolor a connected region of the same color.',
  },
  description: {
    zh: '泛洪填充是图像处理经典操作：给定二维网格 image、起点 (sr,sc) 和新颜色 newColor，将与起点连通（四邻接、同色）的所有格子改为 newColor。DFS 实现：从起点递归，对每个同色邻居递归填充，直到边界或异色。需注意 oldColor === newColor 的边界（避免无限递归）。本实现使用访问标记或颜色判断。',
    en: 'Flood fill is a classic image-processing operation: given a 2D grid, a start (sr,sc), and a new color, recolor all cells connected (4-adjacent, same color) to the start. DFS implementation: recurse from the start, recursing into same-color neighbors until hitting bounds or a different color. Care is needed when oldColor === newColor to avoid infinite recursion. This implementation uses color checks.',
  },
  tags: ['recursion', 'dfs', 'flood-fill', 'grid', 'image'],
  complexity: { time: 'O(m·n)', space: 'O(m·n)' },
};
