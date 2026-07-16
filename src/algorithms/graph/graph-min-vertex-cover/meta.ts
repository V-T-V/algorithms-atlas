import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-min-vertex-cover',
  categoryId: 'graph',
  title: { zh: '最小点覆盖（近似）', en: 'Minimum Vertex Cover (Approximation)' },
  summary: {
    zh: '贪心 2-近似：不断取一条边加入匹配，两端都进覆盖。',
    en: 'Greedy 2-approximation: repeatedly pick an edge and add both endpoints to the cover.',
  },
  description: {
    zh: '最小点覆盖是 NP-hard 问题。经典 2-近似：不断选一条两端都尚未覆盖的边 (u,v)，把 u、v 都加入覆盖集（等价于构造一个极大匹配，并把匹配每条边的两端纳入）。保证 |解| ≤ 2·|OPT|。时间 O(V+E)，空间 O(V)。',
    en: 'Min vertex cover is NP-hard; classic 2-approx: iteratively pick an edge with both endpoints uncovered, add both (maximal matching endpoints). |sol| <= 2|OPT|. Time O(V+E), space O(V).',
  },
  tags: ['graph', 'vertex-cover', 'approximation', 'np-hard'],
  complexity: { time: 'O(V+E)', space: 'O(V)' },
};
