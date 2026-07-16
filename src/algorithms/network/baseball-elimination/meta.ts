// 棒球淘汰问题（Baseball Elimination via Max Flow）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'baseball-elimination',
  categoryId: 'network',
  title: { zh: '棒球淘汰（最大流）', en: 'Baseball Elimination (Max Flow)' },
  summary: {
    zh: '判定某队能否追上分区第一名：把剩余比赛建模为最大流，比较理论最大胜场。',
    en: 'Decide whether a team can still win the division: model remaining games as max flow, compare theoretical max wins.',
  },
  description: {
    zh: '棒球淘汰问题（Schwartz 1966 / Wayne 2001 经典建模）：给定 n 支球队的当前胜场 w[i]、剩余场数 r[i]、剩余两队间剩余场数 g[i][j]，问球队 x 是否已被淘汰（即无论剩余比赛如何分配，x 都不可能单独第一）。\n\n**最大流建模（针对某一候选队 x）**：\n1. 节点：源 s、汇 t、每个「队对 (i,j)」（i<j, i,j≠x）一个节点、每支「队 i」（i≠x）一个节点。\n2. 边：\n   - s → (i,j) 容量 g[i][j]（两队剩余对决场数）。\n   - (i,j) → i 与 (i,j) → j 容量 ∞（这场胜利分给 i 或 j）。\n   - i → t 容量 W − w[i]，其中 W = w[x] + r[x]（x 的最大可能总胜场；超过则 i 追上 x）。\n3. 求最大流：若 = ∑ g[i][j]，则 x 仍可能单独第一；若 < ∑ g[i][j]，则至少有场无解 → x 被淘汰。\n\n**简单上界检测**：若存在 i 使 w[i] > W，则 x 已被「直接淘汰」（无需建流）。\n\n本实现同时输出是否被淘汰 + 若被淘汰给出反例子集（ Hoffman 循环 / 任意超 W 的球队集合）。',
    en: 'Baseball elimination (Schwartz 1966 / Wayne 2001 classic modeling): given n teams with current wins w[i], remaining r[i], remaining games between pair g[i][j], decide if team x is already eliminated (cannot finish alone first no matter how remaining games distribute).\n\n**Max-flow model (for candidate team x)**:\n1. Nodes: source s, sink t, one node per pair (i,j) with i<j and i,j≠x, one node per team i with i≠x.\n2. Edges:\n   - s → (i,j) with capacity g[i][j] (remaining games between them).\n   - (i,j) → i and (i,j) → j with capacity ∞ (the win goes to i or j).\n   - i → t with capacity W − w[i], where W = w[x] + r[x] (x max possible wins; i beats x if exceeds).\n3. Max flow: if = ∑ g[i][j], x can still finish first; if < ∑ g[i][j], x is eliminated.\n\n**Trivial upper bound**: if any i has w[i] > W, x is trivially eliminated.\n\nThis implementation outputs eliminated flag and, if so, a certificate subset (any group of teams whose average wins exceed W).',
  },
  tags: ['network', 'max-flow', 'application', 'baseball-elimination', 'sports-scheduling'],
  complexity: { time: 'O(V·E²)', space: 'O(V + E)' },
  references: [
    {
      label: 'Wayne (2001) A Theorem on Baseball Elimination',
      url: 'https://arxiv.org/abs/math/0109135',
    },
  ],
};
