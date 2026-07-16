// MPM 算法（Malhotra-Pramodh-Maheshwari）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'mpm',
  categoryId: 'network',
  title: { zh: 'MPM 算法', en: 'MPM Algorithm' },
  summary: {
    zh: '分层网络中找「潜在通过量」最小的节点为瓶颈，O(V³) 两阶段推进。',
    en: 'In the level graph, repeatedly find the minimum "potential throughput" node as the bottleneck; O(V³).',
  },
  description: {
    zh: 'MPM（Malhotra, Pramodh, Maheshwari, 1978）是与 Dinic 同时代的最大流算法，复杂度严格 `O(V³)`。每个阶段：\n\n1. **BFS 分层**（同 Dinic），得到分层网络。\n2. **计算每个节点的「潜在通过量」** `pot[v] = min(流入容量之和, 流出容量之和)`，源/汇的 pot 取 ∞。\n3. **找 pot 最小的节点** `u`（瓶颈），其 pot 值 `g` 就是本阶段能推进的最大流。\n4. 从 u 向源回溯、向汇正向推进 g 单位流量，更新残量。\n5. 重复直到分层网络无路。\n\n每阶段至少消除一个节点（pot 最小的），共 V 个阶段；每阶段 O(V²)，总计 `O(V³)`。',
    en: 'MPM (Malhotra, Pramodh, Maheshwari, 1978) is a max-flow algorithm contemporary with Dinic, with strict `O(V³)` complexity. Each phase:\n\n1. **BFS leveling** (same as Dinic), giving the level graph.\n2. **Compute each node\'s "potential throughput"** `pot[v] = min(in-capacity sum, out-capacity sum)`; pot of source/sink is infinity.\n3. **Find the minimum-pot node** `u` (the bottleneck); its pot `g` is the max flow pushable this phase.\n4. Push g units from u back toward the source and forward toward the sink, updating residuals.\n5. Repeat until the level graph has no path.\n\nEach phase eliminates at least one node (the min-pot one); there are V phases; each phase is O(V²); total `O(V³)`.',
  },
  tags: ['network', 'max-flow', 'mpm', 'level-graph'],
  complexity: { time: 'O(V³)', space: 'O(V + E)' },
  references: [
    {
      label: 'MPM algorithm — Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Maximum_flow_problem',
    },
  ],
};
