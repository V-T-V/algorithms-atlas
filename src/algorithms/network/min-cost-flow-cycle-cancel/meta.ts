// 消负环最小费用流（Cycle-Canceling Min-Cost Flow）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'min-cost-flow-cycle-cancel',
  categoryId: 'network',
  title: { zh: '消负环最小费用流', en: 'Cycle-Canceling Min-Cost Flow' },
  summary: {
    zh: '先求任意最大流，再反复消去残量网络中的负费用环，直到无负环。',
    en: 'First find any max flow, then repeatedly cancel negative-cost cycles in the residual graph.',
  },
  description: {
    zh: '消负环算法（Busacker & Gowen, 1961; Klein, 1967）求最小费用最大流的两阶段方法：\n\n1. **求最大流**：用任意最大流算法（如 Edmonds-Karp）得到一个最大流 f。\n2. **消负环**：在残量网络上用 Bellman-Ford 找负费用环。若存在，沿该环推进「环上瓶颈流量」并消除该环；重复直到残量网络无负环。\n\n**正确性**：一个最大流是最小费用流 ⟺ 其残量网络无负环（流量在负环上「搬动」可降费用）。复杂度取决于最大流值与单环消除量，最坏伪多项式 `O(F · E · V)`，F 为流量值。',
    en: 'The cycle-canceling algorithm (Busacker & Gowen, 1961; Klein, 1967) solves min-cost max-flow in two stages:\n\n1. **Find max flow**: use any max-flow algorithm (e.g. Edmonds-Karp) to obtain a max flow f.\n2. **Cancel negative cycles**: use Bellman-Ford to find a negative-cost cycle in the residual graph. If one exists, push the cycle\'s bottleneck flow around it to cancel; repeat until the residual has no negative cycle.\n\n**Correctness**: a max flow is a min-cost flow ⟺ its residual graph has no negative cycle (flow can be "shifted" around a negative cycle to reduce cost). Complexity is pseudopolynomial in the worst case `O(F · E · V)`, where F is the flow value.',
  },
  tags: ['network', 'min-cost-flow', 'cycle-canceling', 'negative-cycle'],
  complexity: { time: 'O(F · V · E)', space: 'O(V + E)' },
  references: [
    {
      label: 'Cycle-Canceling — Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Minimum-cost_flow_problem',
    },
  ],
};
