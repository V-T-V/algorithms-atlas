// BST 范围查询 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'tree-bst-range-query',
  categoryId: 'tree',
  title: { zh: '二叉搜索树范围查询', en: 'Binary Search Tree Range Query' },
  summary: {
    zh: '在 BST 中找出所有值在 [lo, hi] 范围内的节点，利用 BST 性质剪枝。',
    en: 'Collect all nodes with values in [lo, hi] from a BST, pruning using the BST property.',
  },
  description: {
    zh: 'BST 范围查询 [lo, hi]：\n对当前 node：\n- 若 node.value > lo：递归左子树（可能有范围内的更小值）\n- 若 lo <= node.value <= hi：加入结果\n- 若 node.value < hi：递归右子树\n\n利用 BST 性质跳过必然不在范围的子树。复杂度 O(k + log n)，k 为命中数。',
    en: 'BST range query [lo, hi]: at each node, recurse left if node.value>lo (smaller candidates), include node if in range, recurse right if node.value<hi. Prunes subtrees that cannot be in range. Complexity O(k+log n), k = number of hits.',
  },
  tags: ['tree', 'bst', 'range-query', 'binary-search-tree'],
  complexity: { time: 'O(k + log n)', space: 'O(log n)' },
};
