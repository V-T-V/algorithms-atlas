// 贪心二分匹配 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'net-bipartite-match-greedy',
  categoryId: 'network',
  title: { zh: '贪心二分匹配', en: 'Greedy Bipartite Matching' },
  summary: { zh: '对二分图边贪心匹配。', en: 'Greedy matching on a bipartite graph.' },
  description: {
    zh: '按边顺序，若两端都未匹配则匹配。',
    en: 'For each edge, match if both free. O(E).',
  },
  tags: ['network', 'graph', 'matching'],
  complexity: { time: 'O(E)', space: 'O(V)' },
};
