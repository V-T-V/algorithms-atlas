import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-isomorphism',
  categoryId: 'graph',
  title: { zh: '图同构', en: 'Graph Isomorphism' },
  summary: {
    zh: 'VF2 风格回溯：建双射并验证邻域一致性。',
    en: 'VF2-style backtracking: build a bijection and verify neighborhood consistency.',
  },
  description: {
    zh: '两图同构指存在顶点间的双射，使邻接关系完全保持。判定是否同构是复杂度分类上的「疑难」问题（既无已知多项式算法，也未被证明 NP 完全）。本实现采用 VF2 风格回溯：先快排校验顶点数、边数、度序列，再逐步把 G1 的顶点映射到 G2，每次候选必须度数相同、未被占用，且与已映射邻居保持邻接一致性。最坏指数级，实际中小图很快。',
    en: 'Two graphs are isomorphic if a vertex bijection preserves adjacency; deciding this sits in a complexity-theoretic grey area (no known polynomial algorithm, not proven NP-complete). This VF2-style backtracking pre-filters by vertex/edge counts and degree sequence, then maps G1 into G2 vertex by vertex, requiring equal degrees, unused targets, and neighborhood consistency with already-mapped neighbors. Worst-case exponential but fast on small graphs.',
  },
  tags: ['graph', 'isomorphism', 'backtracking', 'vf2'],
  complexity: { time: 'O(n!)', space: 'O(n)' },
};
