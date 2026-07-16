// 模式数据库 (Pattern Database) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ais-pattern-database',
  categoryId: 'ai-search',
  title: { zh: '模式数据库 (PDB)', en: 'Pattern Database (PDB)' },
  summary: {
    zh: '预先 BFS 求一组关键子到目标的距离，搜索时查表作为更紧的启发式。',
    en: 'Precompute via BFS the distances of a subset of key tiles to the goal, then query the table as a tighter heuristic during search.',
  },
  description: {
    zh: '模式数据库（Pattern Database, PDB）是搜索中的强力启发式构造法，广泛用于拼图（15-puzzle、魔方）。选定一组「关键子」，对它们所有可达排列，用 BFS（忽略其他子）记录到目标的最少步数，存入表。搜索时，对当前状态的关键子排列查表，得到一个可采纳（不高估）且比曼哈顿距离更紧的启发式，大幅减少 A*/IDA* 展开节点数。本实现演示对简化 4-puzzle 的 2 子模式库构建。',
    en: 'A Pattern Database (PDB) is a powerful heuristic construction technique widely used in puzzles (15-puzzle, Rubiks cube). Choose a subset of "key tiles"; for every reachable arrangement of them, BFS (ignoring other tiles) records the minimum steps to the goal, stored in a table. During search, the current states key arrangement is queried to yield an admissible (non-overestimating) heuristic tighter than Manhattan distance, dramatically reducing A*/IDA* node expansions. This implementation demonstrates building a 2-tile PDB for a simplified 4-puzzle.',
  },
  tags: ['ai-search', 'heuristic', 'pattern-database', 'puzzle', 'bfs'],
  complexity: { time: 'O(P!·b^d)', space: 'O(P!)' },
};
