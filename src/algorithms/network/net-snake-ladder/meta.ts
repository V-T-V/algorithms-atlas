// 蛇梯棋 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'net-snake-ladder',
  categoryId: 'network',
  title: { zh: '蛇梯棋', en: 'Snakes and Ladders' },
  summary: {
    zh: 'BFS 求蛇梯棋从 1 到 n² 的最少步数。',
    en: 'Min moves from 1 to n^2 in snakes and ladders.',
  },
  description: {
    zh: '每步掷骰 1-6，遇梯子/蛇瞬移。BFS。',
    en: 'BFS with dice 1-6; teleports. O(n^2).',
  },
  tags: ['network', 'graph', 'bfs'],
  complexity: { time: 'O(n^2)', space: 'O(n^2)' },
};
