// Morris 遍历 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'tree-morris-traversal',
  categoryId: 'tree',
  title: { zh: 'Morris 遍历', en: 'Morris Traversal' },
  summary: {
    zh: 'O(1) 空间中序遍历：用前驱节点的右线索临时串回当前。',
    en: 'Inorder traversal in O(1) space via temporary right threads to predecessors.',
  },
  description: {
    zh:
      'Morris 遍历（Morris Inorder Traversal）：在 `O(1)` 额外空间内完成中序遍历，无需栈或递归。' +
      '\n核心思想：对每个节点 cur，找到其左子树中序前驱 pred（左子树最右节点）。' +
      '\n- 若 pred.right 为空，把它临时指向 cur（建立线索），cur 转向 cur.left。' +
      '\n- 若 pred.right === cur，说明线索已建立（左子树已遍历完），**断开线索**恢复树结构，访问 cur，cur 转向 cur.right。' +
      '\n- 若 cur 无左子，直接访问 cur，cur 转向 cur.right。' +
      '\n时间 `O(n)`（每条边最多走 2~3 次），空间 `O(1)`。线索在遍历后全部还原。',
    en:
      'Morris Traversal: in-order traversal in O(1) extra space, no stack or recursion. ' +
      '\nKey idea: for each node cur, find its in-order predecessor pred (rightmost of the left subtree). ' +
      '\n- If pred.right is null, temporarily point it at cur (a thread), then move cur to cur.left. ' +
      '\n- If pred.right === cur, the thread exists (left subtree done); break it to restore the tree, ' +
      'visit cur, and move cur to cur.right. ' +
      '\n- If cur has no left child, visit cur directly and move to cur.right. ' +
      'Time O(n) (each edge touched 2~3 times), space O(1). All threads are undone afterwards.',
  },
  tags: ['tree', 'traversal', 'inorder', 'morris', 'constant-space', 'threading'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
