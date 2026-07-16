// RBFS 递归最佳优先（Recursive Best-First Search）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ais-rbfs-search',
  categoryId: 'ai-search',
  title: { zh: 'RBFS 递归最佳优先', en: 'Recursive Best-First Search' },
  summary: {
    zh: '线性空间最佳优先，f 上界随递归回传。',
    en: 'Linear-space best-first with f-limit backtracking.',
  },
  description: {
    zh: 'RBFS(Russell 1992)用线性内存模拟最佳优先：递归记录当前路径上每个节点的 f 上界，回溯时把次优 f 传回。',
    en: 'RBFS mimics best-first in linear space by tracking an f-limit along the recursion path and back-propagating alternate f.',
  },
  tags: ['ai-search', 'rbfs', 'heuristic'],
  complexity: { time: 'O(b^d)', space: 'O(d)' },
};
