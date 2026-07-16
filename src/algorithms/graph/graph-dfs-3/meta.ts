import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-dfs-3',
  categoryId: 'graph',
  title: { zh: '三色 DFS（白灰黑）', en: 'Three-Color DFS (White/Gray/Black)' },
  summary: {
    zh: '用白/灰/黑三色标记节点状态，便于检测回边（环）。',
    en: 'Color nodes white→gray→black to detect back edges and cycles during DFS.',
  },
  description: {
    zh: 'WHITE 未访问；GRAY 在递归栈中（已发现但未完成）；BLACK 已完成。若 DFS 中遇到 GRAY 节点即发现回边（环）。',
    en: 'WHITE=unvisited, GRAY=in recursion stack, BLACK=finished. Encountering a GRAY node during DFS reveals a back edge / cycle.',
  },
  tags: ['graph', 'dfs', 'cycle-detection'],
  complexity: { time: 'O(V+E)', space: 'O(V)' },
};
