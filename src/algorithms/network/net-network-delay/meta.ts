// 网络延迟时间 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'net-network-delay',
  categoryId: 'network',
  title: { zh: '网络延迟时间', en: 'Network Delay Time' },
  summary: {
    zh: '信号从某节点发出，求所有节点收到的最短时间（Dijkstra 后取最大）。',
    en: 'Max distance from source after Dijkstra = time to reach all.',
  },
  description: {
    zh: 'Dijkstra 后取 dist 最大值。',
    en: 'Dijkstra then take max dist. O(E log V).',
  },
  tags: ['network', 'graph', 'shortest-path'],
  complexity: { time: 'O(E log V)', space: 'O(V)' },
};
