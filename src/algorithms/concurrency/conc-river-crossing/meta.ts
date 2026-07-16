// 传教士与野人过河 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'conc-river-crossing',
  categoryId: 'concurrency',
  title: { zh: '传教士与野人过河', en: 'Missionaries and Cannibals' },
  summary: {
    zh: '3 传教士 3 野人用 2 人船过河，任一岸野人不得多于传教士。',
    en: '3 missionaries and 3 cannibals cross with a 2-seat boat; neither bank may have more cannibals than missionaries.',
  },
  description: {
    zh: '经典状态空间搜索：状态为 (左岸传教士, 左岸野人, 船位置)。安全约束：任一岸若传教士数 >0，则传教士数 >= 野人数。BFS 寻找最少渡河步数。',
    en: 'Classic state-space search: state is (leftM, leftC, boatSide). Safety: on any bank with missionaries>0, missionaries >= cannibals. BFS finds the minimum crossing steps.',
  },
  tags: ['concurrency', 'state-space-search', 'bfs', 'puzzle'],
  complexity: { time: 'O(b^d)', space: 'O(b^d)' },
};
