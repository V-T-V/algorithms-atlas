// 重建行程 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'net-reconstruct-itinerary',
  categoryId: 'network',
  title: { zh: '重建行程', en: 'Reconstruct Itinerary (Hierholzer)' },
  summary: {
    zh: '用 Hierholzer 算法从机票重建字典序最小的欧拉路径。',
    en: 'Lexicographically smallest Eulerian itinerary via Hierholzer.',
  },
  description: {
    zh: '邻接表按字典序，DFS 后序逆序输出。',
    en: 'Post-order DFS on sorted adjacency, reverse. O(E log E).',
  },
  tags: ['network', 'graph', 'euler'],
  complexity: { time: 'O(E log E)', space: 'O(E)' },
};
