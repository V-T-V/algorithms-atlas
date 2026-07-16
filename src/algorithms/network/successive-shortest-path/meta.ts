// 逐次最短增广路（Successive Shortest Path）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'successive-shortest-path',
  categoryId: 'network',
  title: { zh: '逐次最短增广路', en: 'Successive Shortest Path' },
  summary: {
    zh: '每次在残量网络中找费用最短的 s→t 路增广，用 Johnson 势能处理负费用边。',
    en: 'Repeatedly augment along the shortest (by cost) s→t path in the residual graph; Johnson potentials handle negative-cost edges.',
  },
  description: {
    zh: '逐次最短增广路（SSP）算法求最小费用流：\n\n1. 维护「节点势能」 `pot[v]`（满足 reduced cost = cost + pot[u] - pot[v] ≥ 0 的性质，使 Dijkstra 可用）。\n2. 每次用 Dijkstra（在 reduced cost 上）找当前残量网络中 s→t 的最短路 P。\n3. 沿 P 推进「瓶颈流量」，累加实际费用。\n4. 更新势能 `pot[v] += dist[v]`。\n5. 重复直到无法到达 t（最大流）或达到所需流量。\n\n复杂度 `O(F · E log V)`，F 为流量。比消负环算法快得多，是最常用的最小费用流算法。',
    en: 'Successive Shortest Path (SSP) computes a min-cost flow:\n\n1. Maintain node "potentials" `pot[v]` so the reduced cost = cost + pot[u] - pot[v] ≥ 0, allowing Dijkstra.\n2. Each iteration, run Dijkstra (on reduced costs) to find the shortest s→t path P in the residual graph.\n3. Push the bottleneck flow along P, accumulating real cost.\n4. Update potentials `pot[v] += dist[v]`.\n5. Repeat until t is unreachable (max flow reached) or the demand is satisfied.\n\nComplexity `O(F · E log V)`, F = flow value. Much faster than cycle-canceling; the most commonly used min-cost flow algorithm.',
  },
  tags: ['network', 'min-cost-flow', 'dijkstra', 'potentials'],
  complexity: { time: 'O(F · E log V)', space: 'O(V + E)' },
  references: [
    {
      label: 'Min-cost flow — CP-Algorithms',
      url: 'https://cp-algorithms.com/graph/min_cost_flow.html',
    },
  ],
};
