// Bellman-Ford · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'net-bellman-ford',
  categoryId: 'network',
  title: { zh: 'Bellman-Ford', en: 'Bellman-Ford' },
  summary: {
    zh: '允许负权边的单源最短路，可检测负环。',
    en: 'Single-source shortest path allowing negative edges; detects negative cycles.',
  },
  description: {
    zh: '对所有边松弛 V-1 轮；再松弛一次若仍能更新则有负环。',
    en: 'Relax all edges V-1 times; one more detects neg cycle. O(VE).',
  },
  tags: ['network', 'graph', 'shortest-path'],
  complexity: { time: 'O(VE)', space: 'O(V)' },
};
