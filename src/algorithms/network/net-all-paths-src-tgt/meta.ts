// 源到汇所有路径 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'net-all-paths-src-tgt',
  categoryId: 'network',
  title: { zh: '源到汇所有路径', en: 'All Paths Source to Target' },
  summary: { zh: 'DAG 中所有从 0 到 n-1 的路径。', en: 'All paths from 0 to n-1 in a DAG.' },
  description: { zh: 'DFS 回溯收集。', en: 'DFS backtracking. O(2^V * V) worst.' },
  tags: ['network', 'graph', 'dfs'],
  complexity: { time: 'O(2^V * V)', space: 'O(V)' },
};
