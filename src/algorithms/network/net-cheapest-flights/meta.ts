// K站最便宜航班 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'net-cheapest-flights',
  categoryId: 'network',
  title: { zh: 'K站最便宜航班', en: 'Cheapest Flights within K Stops' },
  summary: {
    zh: 'Bellman-Ford 限制 K 步求最便宜航班。',
    en: 'Cheapest flight within K stops (Bellman-Ford bounded).',
  },
  description: {
    zh: '松弛 K+1 轮，每轮用上一轮的 dist。',
    en: 'Relax K+1 rounds with prev dist. O(K*E).',
  },
  tags: ['network', 'graph', 'bellman-ford'],
  complexity: { time: 'O(K*E)', space: 'O(V)' },
};
