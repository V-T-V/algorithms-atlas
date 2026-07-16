// 最小费用最大流（Min-Cost Max-Flow）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'min-cost-max-flow',
  categoryId: 'network',
  title: { zh: '最小费用最大流', en: 'Min-Cost Max-Flow' },
  summary: {
    zh: '在最大流基础上求总费用最小：SPFA 找费用最短增广路逐次增广。',
    en: 'Among maximum flows pick the one with minimum total cost; SPFA-based augmenting paths.',
  },
  description: {
    zh: '最小费用最大流问题：每条边有容量 cap 与单位费用 cost，求一个流量最大的流，且在所有最大流中总费用最小。\n\n**SPFA 增广算法**（连续最短路）：\n1. 残量网络上用 SPFA（Bellman-Ford 队列优化）找一条从 s 到 t 的「单位费用最短」增广路（反向边费用为原费用的相反数，故可能存在负权边，不能用 Dijkstra）。\n2. 沿该路增广瓶颈流量 flow，累计费用 += flow × 路径费用。\n3. 重复直到不存在 s→t 增广路。此时流量最大，且总费用最小。\n\n正确性：每次增广都选当前费用最短路，等价于把费用当距离逐次松弛，最终是凸费用函数下的最优解。复杂度上界 O(V·E²·maxFlow)，实际通常远好于此。',
    en: 'Min-Cost Max-Flow: each edge has capacity cap and unit cost; find a maximum flow that minimizes total cost.\n\n**SPFA augmentation** (successive shortest paths):\n1. On the residual network, run SPFA (queue-based Bellman-Ford) to find an s→t augmenting path with minimum unit cost (reverse edges have negative cost, so Dijkstra cannot be used).\n2. Augment the bottleneck flow along it; accumulate cost += flow × path cost.\n3. Repeat until no s→t path exists. The flow is then maximum and the cost minimal.\n\nCorrectness: each step picks the cheapest path, equivalent to relaxing cost as distance; yields the optimum under a convex cost function. Worst case O(V·E²·maxFlow), typically much faster.',
  },
  tags: ['network', 'min-cost-flow', 'spfa', 'shortest-path', 'augmenting-path'],
  complexity: { time: 'O(V·E²·F)', space: 'O(V + E)' },
};
