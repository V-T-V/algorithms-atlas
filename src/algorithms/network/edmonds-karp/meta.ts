// Edmonds-Karp 最大流 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'edmonds-karp',
  categoryId: 'network',
  title: { zh: 'Edmonds-Karp 最大流', en: 'Edmonds-Karp Max Flow' },
  summary: {
    zh: '用 BFS 找最短增广路的 Ford-Fulkerson，保证 O(V·E²)。',
    en: 'Ford-Fulkerson with BFS shortest augmenting paths; guaranteed O(V·E²).',
  },
  description: {
    zh: 'Edmonds-Karp 是 Ford-Fulkerson 方法的具体化：每轮用 BFS 在残量图上找一条节点数最少的 s→t 增广路，沿路推进瓶颈容量。\n\nBFS 保证每条增广路长度单调不增，且总共只需 `O(V·E)` 次增广，故总时间 `O(V·E²)`，与容量大小无关（整数/有理容量下 Ford-Fulkerson 可能依赖容量）。\n\n核心：\n- 残量图：每条原图边配一条初始容量 0 的反向边；\n- BFS 找路 → 沿路更新残量；\n- 直到 BFS 找不到路，累计的流量即最大流。',
    en: 'Edmonds-Karp instantiates Ford-Fulkerson: each round BFS finds a shortest (fewest-hops) s→t augmenting path in the residual graph, then pushes the bottleneck along it.\n\nBFS makes path lengths monotone, bounding augmentations to `O(V·E)`, so total time is `O(V·E²)` — independent of capacities (plain Ford-Fulkerson can depend on them).\n\nCore:\n- Residual graph: each original edge paired with a reverse edge of initial capacity 0;\n- BFS a path → update residual capacities along it;\n- Stop when BFS finds nothing; accumulated flow is the max flow.',
  },
  tags: ['network', 'max-flow', 'bfs', 'ford-fulkerson'],
  complexity: { time: 'O(V·E²)', space: 'O(V + E)' },
};
