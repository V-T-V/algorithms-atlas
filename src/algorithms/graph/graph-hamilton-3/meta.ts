import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-hamilton-3',
  categoryId: 'graph',
  title: { zh: '哈密顿回路（回溯）', en: 'Hamiltonian Cycle (Backtracking)' },
  summary: {
    zh: '回溯搜索经过每个顶点恰好一次并回到起点的回路。',
    en: 'Backtracking search for a cycle visiting every vertex exactly once and returning.',
  },
  description: {
    zh: '从起点开始，逐步尝试加入相邻且未访问的顶点。若路径长度达到 n 且最后能与起点相连，则找到哈密顿回路；否则回溯。',
    en: 'Build a path from the start, extending to adjacent unvisited vertices. When length reaches n and last connects to start, found; else backtrack.',
  },
  tags: ['graph', 'hamiltonian', 'backtracking'],
  complexity: { time: 'O(n!)', space: 'O(n)' },
};
