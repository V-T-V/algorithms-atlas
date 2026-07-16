// Dinic 最大流 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dinic-maxflow',
  categoryId: 'network',
  title: { zh: 'Dinic 最大流', en: 'Dinic Max Flow' },
  summary: {
    zh: '分层网络 + DFS 求阻塞流，复杂度 O(V²·E)，单位容量图更快。',
    en: 'Level graph plus DFS blocking flow; O(V²·E) and faster on unit-capacity graphs.',
  },
  description: {
    zh: 'Dinic 算法分阶段进行：\n\n1. **BFS 分层**：从源点 s 出发，给每个可达节点打层数 `level[v]`（到 s 的最短跳数），只有 `level[v] = level[u]+1` 的弧进入「分层网络」。\n2. **DFS 阻塞流**：在分层网络上用 DFS 反复找 s→t 路并推进，直到该分层网络不存在增广路（即「阻塞」）。配合 `cur[u]` 当前弧优化避免重复扫描已用尽的弧。\n3. 重复 1-2 直到 BFS 无法到达 t。\n\n每阶段最短增广路长度严格递增，至多 V 个阶段；每阶段 DFS（含当前弧优化）总开销 `O(V·E)`，故总计 `O(V²·E)`。\n\n在单位容量图上为 `O(E·√V)`。',
    en: 'Dinic proceeds in phases:\n\n1. **BFS level graph**: from source s, assign each reachable node a level (shortest hop count to s); only arcs with `level[v] = level[u]+1` enter the level graph.\n2. **DFS blocking flow**: repeatedly find s→t paths in the level graph and push until it is "blocked". A `cur[u]` current-arc pointer avoids rescanning exhausted arcs.\n3. Repeat 1-2 until BFS can no longer reach t.\n\nEach phase strictly increases the shortest augmenting path length, bounding phases to V; each DFS phase is `O(V·E)` with current-arc optimization, so `O(V²·E)` total.\n\nOn unit-capacity graphs it is `O(E·√V)`.',
  },
  tags: ['network', 'max-flow', 'bfs', 'dfs', 'level-graph'],
  complexity: { time: 'O(V²·E)', space: 'O(V + E)' },
};
