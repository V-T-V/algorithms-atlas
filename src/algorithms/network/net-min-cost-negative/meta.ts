// 含负费用边的最小费用流 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'net-min-cost-negative',
  categoryId: 'network',
  title: { zh: '含负费用边的最小费用流', en: 'Min-Cost Flow with Negative Edges' },
  summary: {
    zh: '用 Johnson 势能（Bellman-Ford 预处理）消除负费用边，再用 Dijkstra 增广。',
    en: 'Use Johnson potentials (Bellman-Ford preprocessing) to eliminate negative-cost edges, then augment via Dijkstra.',
  },
  description: {
    zh: '当费用图含负边时，直接用 Dijkstra 不正确。先用 Bellman-Ford 从源点求最短路势 h(v)（若无负圈），把每条边费用 c(u,v) 替换为 c′=c+h(u)−h(v)≥0，于是所有边非负。之后每轮 Dijkstra 增广并更新势能。这保证了含负边（无负圈）时的正确性与高效性。',
    en: "When the cost graph has negative edges, Dijkstra alone is incorrect. First run Bellman-Ford from the source to obtain potentials h(v) (assuming no negative cycle), replacing each edge cost c(u,v) by c'=c+h(u)-h(v)>=0 so all edges become non-negative. Subsequent Dijkstra augmentations update potentials. This guarantees correctness and efficiency with negative edges (no negative cycle).",
  },
  tags: ['network', 'min-cost-flow', 'negative-cost', 'johnson-potential', 'bellman-ford'],
  complexity: { time: 'O(V·E + F·E·log V)', space: 'O(V + E)' },
};
