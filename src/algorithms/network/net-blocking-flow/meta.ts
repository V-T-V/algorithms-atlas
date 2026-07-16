// 阻塞流 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'net-blocking-flow',
  categoryId: 'network',
  title: { zh: '阻塞流 (Blocking Flow)', en: 'Blocking Flow' },
  summary: {
    zh: '在分层图中用 DFS（当前弧优化）求一条阻塞流：每条 s-t 路径至少一条边饱和。',
    en: 'Use DFS with current-arc optimization on the level graph to find a blocking flow where every s-t path has at least one saturated edge.',
  },
  description: {
    zh: '阻塞流：在分层图（仅含严格上升边）中，沿 DFS 找增广路直至无法从源到达汇。当前弧优化：每个节点记录已尝试过的出边下标，避免重复扫描，使单轮阻塞流复杂度 O(VE)。阻塞流是 Dinic 每一阶段推送的流量，保证分层图被「堵死」后重新分层。',
    en: "Blocking flow: in the level graph (only strictly ascending edges), DFS-augment until the sink is unreachable from the source. Current-arc optimization tracks each node's next outgoing edge to try, avoiding rescans and yielding O(VE) per phase. The blocking flow is what each Dinic phase pushes; once blocked, the level graph is rebuilt.",
  },
  tags: ['network', 'max-flow', 'dinic', 'blocking-flow', 'dfs'],
  complexity: { time: 'O(V·E)', space: 'O(V + E)' },
};
