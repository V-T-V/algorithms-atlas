import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-landmark',
  categoryId: 'graph',
  title: { zh: '地标最短路（ALT）', en: 'Landmark Shortest Path (ALT)' },
  summary: {
    zh: '预选若干地标求最短距离下界，加速 A*。',
    en: 'Precompute distances to landmark vertices to derive lower bounds that speed up A*.',
  },
  description: {
    zh: '地标算法（Landmark / ALT: A* + Landmarks + Triangle inequality）。预选若干「地标」节点 L，对每个地标预计算它到所有节点的最短距离 d(ℓ,v)（Dijkstra 反向）。对查询 (s,t)，由三角不等式 d(s,t) ≥ d(ℓ,t) - d(ℓ,s)，对所有地标取最大下界作为 A* 启发 h(s)=max_ℓ |d(ℓ,t)-d(ℓ,s)|（admissible）。本实现演示单查询 + 多地标下界估计。预处理 O(|L|·(E log V))，单查询用 A*。',
    en: 'ALT heuristic: pick landmarks L, precompute d(ell,v); lower bound h(s)=max over ell of |d(ell,t)-d(ell,s)|. Admissible, accelerates A*. Preprocess O(|L|·E log V).',
  },
  tags: ['graph', 'shortest-path', 'astar', 'heuristic', 'landmark'],
  complexity: { time: 'O(E log V) per query', space: 'O(|L|·V)' },
};
