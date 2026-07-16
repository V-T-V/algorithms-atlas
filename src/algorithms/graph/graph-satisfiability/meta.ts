import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-satisfiability',
  categoryId: 'graph',
  title: { zh: '3-SAT 贪心求解', en: '3-SAT Greedy Solver' },
  summary: {
    zh: '贪心试探给变量赋值，最大化被满足的 3-CNF 子句数。',
    en: 'Greedy assignment maximizing the number of satisfied 3-CNF clauses.',
  },
  description: {
    zh: '3-SAT 是 NP 完全问题，这里给出贪心近似：每步选当前使最多子句被满足的变量赋值（Johnson 启发式——每变量按其在未决子句中正/负出现次数决定取真/假），直到所有变量赋值，返回满足的子句数与赋值。注意已有 two-sat（多项式精确），3-SAT 无多项式精确解，故用启发式。时间 O(V·C)，空间 O(V+C)。',
    en: '3-SAT is NP-complete; this is a greedy heuristic: assign each variable to satisfy the most clauses (Johnson-style by positive/negative occurrence counts). Returns the satisfied count and assignment. Existing two-sat is polynomial-exact; 3-SAT has none, hence heuristic. Time O(V·C), space O(V+C).',
  },
  tags: ['sat', 'greedy', 'heuristic'],
  complexity: { time: 'O(V·C)', space: 'O(V+C)' },
};
