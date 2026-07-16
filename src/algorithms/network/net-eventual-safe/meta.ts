// 查找最终安全状态 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'net-eventual-safe',
  categoryId: 'network',
  title: { zh: '查找最终安全状态', en: 'Find Eventual Safe States' },
  summary: {
    zh: '在图中找必然到达终点的节点（无出边或全指向安全节点）。',
    en: 'Nodes guaranteed to reach a terminal (no cycle reachable).',
  },
  description: { zh: '反向图拓扑：先标终点，反向剥。', en: 'Reverse topo from terminals. O(V+E).' },
  tags: ['network', 'graph', 'topological-sort'],
  complexity: { time: 'O(V+E)', space: 'O(V)' },
};
