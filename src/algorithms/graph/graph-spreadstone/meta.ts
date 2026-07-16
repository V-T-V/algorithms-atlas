import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-spreadstone',
  categoryId: 'graph',
  title: { zh: '石子蔓延', en: 'Spread Stones (Multi-Source BFS)' },
  summary: {
    zh: '多个石源同时蔓延，求每个空格到最近石源的距离。',
    en: 'Multiple stone sources spread at once; find each empty cell distance to nearest source.',
  },
  description: {
    zh: '给定 m×n 网格：正值表示该格有若干石子（源），0 表示空。所有石源同时向外蔓延（4 连通，每步距离 +1），求每个空格到最近石源的距离；并返回最远的空格距离（蔓延所需最大轮数）。多源 BFS：把所有源同时入队，按层扩展，首次到达即为最近。时间 O(mn)，空间 O(mn)。',
    en: 'On an m×n grid (positive = stone source, 0 = empty), all sources spread simultaneously (4-connect, +1 per step); find each empty cell distance to the nearest source and the max (rounds needed). Multi-source BFS enqueues all sources; first arrival is nearest. Time O(mn), space O(mn).',
  },
  tags: ['bfs', 'multi-source', 'grid'],
  complexity: { time: 'O(mn)', space: 'O(mn)' },
};
