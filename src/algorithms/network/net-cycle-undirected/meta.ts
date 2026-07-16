// 无向图判环 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'net-cycle-undirected',
  categoryId: 'network',
  title: { zh: '无向图判环', en: 'Cycle Detection (Undirected)' },
  summary: { zh: 'DFS 判断无向图是否有环。', en: 'DFS cycle detection in an undirected graph.' },
  description: {
    zh: '记录父节点，若遇到已访问且非父则有环。',
    en: 'Track parent; visited non-parent => cycle. O(V+E).',
  },
  tags: ['network', 'graph', 'cycle'],
  complexity: { time: 'O(V+E)', space: 'O(V)' },
};
