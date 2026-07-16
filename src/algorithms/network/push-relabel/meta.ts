// 预流推进最大流（Push-Relabel）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'push-relabel',
  categoryId: 'network',
  title: { zh: '预流推进最大流', en: 'Push-Relabel Max Flow' },
  summary: {
    zh: '高度标号 + 推送/重标操作，复杂度 O(V²·E)，gap/relabel 优化更快。',
    en: 'Height labels with push/relabel operations; O(V²·E), faster with gap heuristics.',
  },
  description: {
    zh: '预流推进（Goldberg-Tarjan）维护每个节点的「超额流」e[v] 与「高度」h[v]，通过两类局部操作把流量从源推向汇：\n\n1. **PUSH(u,v)**：若 u 有超额流、h[u]=h[v]+1 且残量>0，则把 min(e[u], 残量) 推到 v。若推满整条边则称为饱和推送。\n2. **RELABEL(u)**：若 u 有超额流但无法 push 给任何邻居，则把 h[u] 升至 min(h[v])+1，使 push 成为可能。\n\n初始 h[s]=V，其余 h=0；所有 s 的出边饱和推送。终止时所有节点（除 s,t）超额流为 0，t 的超额流即最大流。\n\n「当前弧」优化让每个节点的扫描指针只前进，整体 O(V²·E)；配合 gap 启发式（某高度突然无节点则批量抬高）在实践中接近线性。',
    en: 'Push-Relabel (Goldberg-Tarjan) maintains per-node "excess" e[v] and "height" h[v], pushing flow from source to sink via two local operations:\n\n1. **PUSH(u,v)**: if u has excess, h[u]=h[v]+1 and residual>0, push min(e[u], residual) to v. Saturating if it fills the edge.\n2. **RELABEL(u)**: if u has excess but cannot push anywhere, raise h[u] to min(h[v])+1.\n\nInitially h[s]=V and all others h=0; all edges out of s are saturating-pushed. When no node (except s,t) has excess, the excess at t is the max flow.\n\nThe "current-arc" pointer makes each node scan only forward, giving O(V²·E); the gap heuristic (no node at some height -> bulk-relabel) is near-linear in practice.',
  },
  tags: ['network', 'max-flow', 'push-relabel', 'preflow'],
  complexity: { time: 'O(V²·E)', space: 'O(V + E)' },
};
