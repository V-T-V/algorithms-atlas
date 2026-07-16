// 容量缩放 Dinic（Capacity Scaling Dinic）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dinic-scaling',
  categoryId: 'network',
  title: { zh: '容量缩放 Dinic', en: 'Capacity Scaling Dinic' },
  summary: {
    zh: 'Dinic 上叠加容量缩放：每轮只处理残量 ≥ 阈值 的边，阈值逐轮减半。',
    en: 'Dinic with capacity scaling: each round only edges with residual >= threshold are used; threshold halves each round.',
  },
  description: {
    zh: '容量缩放 Dinic 是 Dinic 的一个变体：维护一个全局阈值 `Δ`（初始为最大的 2 的幂 ≤ 最大容量），每轮只允许使用残量 ≥ Δ 的边做 BFS 分层 + DFS 增广。当某一轮再无增广路时，把 Δ 减半，重复直到 Δ=0。\n\n这样每轮的增广都推进至少 Δ 的流量，总轮数 = O(log U)（U = 最大容量），单轮 Dinic 复杂度 `O(V·E)`，总计 `O(V·E·log U)`。对容量分布跨度大的图比普通 Dinic 更稳定。',
    en: 'Capacity Scaling Dinic is a variant of Dinic: maintain a global threshold `Δ` (initially the largest power of 2 ≤ max capacity); each phase runs BFS leveling + DFS augment only on edges with residual ≥ Δ. When no augmenting path exists at this threshold, halve Δ and repeat until Δ = 0.\n\nEach phase pushes at least Δ flow, so there are O(log U) phases (U = max capacity); each phase is `O(V·E)`, giving `O(V·E·log U)` total. More stable than plain Dinic when capacities span a wide range.',
  },
  tags: ['network', 'max-flow', 'dinic', 'capacity-scaling'],
  complexity: { time: 'O(V·E·log U)', space: 'O(V + E)' },
  references: [
    {
      label: 'Capacity scaling — CP-Algorithms',
      url: 'https://cp-algorithms.com/graph/dinic.html',
    },
  ],
};
