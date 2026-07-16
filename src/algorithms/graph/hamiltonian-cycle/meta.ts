import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hamiltonian-cycle',
  categoryId: 'graph',
  title: { zh: '哈密顿回路', en: 'Hamiltonian Cycle' },
  summary: {
    zh: '回溯搜索经过每个顶点恰好一次并回到起点的回路。',
    en: 'Backtracking for a cycle visiting each vertex exactly once.',
  },
  description: {
    zh: '哈密顿回路是经过图中每个顶点恰好一次并回到起点的闭合路径。判定其是否存在是 NP 完全问题。本实现用回溯：固定起点，逐步把未访问且与当前末顶点相邻的顶点加入路径；当路径长度等于顶点数时检查末顶点是否与起点相邻。无解则回溯。最坏时间 O(n!)。',
    en: 'A Hamiltonian cycle visits every vertex exactly once and returns to the start; deciding existence is NP-complete. This implementation backtracks from a fixed start, appending unvisited neighbors until the path covers all vertices, then checks adjacency back to the start. Worst-case time O(n!).',
  },
  tags: ['graph', 'hamiltonian', 'backtracking', 'np-hard', 'cycle'],
  complexity: { time: 'O(n!)', space: 'O(n)' },
};
