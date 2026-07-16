// 路径总和 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'tree-path-sum',
  categoryId: 'tree',
  title: { zh: '路径总和', en: 'Path Sum' },
  summary: {
    zh: '判断是否存在根到叶路径，其节点值之和等于目标（LeetCode 112）。',
    en: 'Decide whether a root-to-leaf path sums to the target (LeetCode 112).',
  },
  description: {
    zh:
      '路径总和（Path Sum，LeetCode 112）：给定二叉树和目标和 targetSum，判断是否存在一条「根到叶」路径，' +
      '使路径上节点值之和恰好等于 targetSum。' +
      '\n递归做法：' +
      '\n- 到达叶子（左右子皆空）时，检查剩余 sum 是否等于该叶值。' +
      '\n- 否则递归左右子树，sum 减去当前节点值。' +
      '\n- 任一子树返回 true 即整体 true。' +
      '\n时间 `O(n)`，空间 `O(h)`。空树返回 false。',
    en:
      'Path Sum (LeetCode 112): given a binary tree and a target sum, decide whether some root-to-leaf path ' +
      'has node values summing exactly to the target. ' +
      '\nRecursion: ' +
      '\n- At a leaf (no children), check if the remaining sum equals the leaf value. ' +
      '\n- Otherwise recurse into both children with sum reduced by the current value. ' +
      '\n- If either subtree returns true, the whole answer is true. ' +
      'Time O(n), space O(h). An empty tree yields false.',
  },
  tags: ['tree', 'path-sum', 'root-to-leaf', 'recursive', 'dfs'],
  complexity: { time: 'O(n)', space: 'O(h)' },
};
