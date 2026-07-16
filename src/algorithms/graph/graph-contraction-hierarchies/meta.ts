import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-contraction-hierarchies',
  categoryId: 'graph',
  title: { zh: '层次收缩 (CH)', en: 'Contraction Hierarchies' },
  summary: {
    zh: '按节点重要性依次收缩并加捷径，查询时双向 Dijkstra 只上行。',
    en: 'Contract nodes by importance adding shortcuts; bidirectional Dijkstra goes upward only.',
  },
  description: {
    zh: '层次收缩（Contraction Hierarchies, CH）。预处理：给节点定「重要性顺序」，从低到高依次「收缩」一个节点——删除它并为经过它的最短路径对添加 shortcut 边。查询：双向 Dijkstra，前向只走重要性更高、反向只走更低，相遇得最短路。CH 是大规模路网最实用的最短路算法之一。预处理复杂度较高 O(V·(E log E))，查询接近 O(log V)。本实现给出核心收缩 + 上行查询演示。',
    en: 'Contraction Hierarchies: contract nodes by importance adding shortcuts for through paths; query via upward bidirectional Dijkstra. Preprocess O(V·E log E), query near O(log V).',
  },
  tags: ['graph', 'shortest-path', 'contraction', 'bidirectional'],
  complexity: { time: 'O(E log V) per query', space: 'O(E)' },
};
