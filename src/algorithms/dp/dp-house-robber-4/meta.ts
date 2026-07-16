import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-house-robber-4',
  categoryId: 'dp',
  title: { zh: '打家劫舍 III（树形）', en: 'House Robber III (Tree DP)' },
  summary: {
    zh: '二叉树形村庄，相邻节点不能同时抢，求最大收益。',
    en: 'Tree-shaped village; cannot rob adjacent nodes; maximize the loot.',
  },
  description: {
    zh: 'LeetCode 337。在二叉树上「打家劫舍」：若抢了某节点，则不能抢其左右孩子，但可以抢孙子辈。对每个节点返回 [rob, notRob]：rob = node.val + 左 notRob + 右 notRob；notRob = max(左 rob,左 notRob) + max(右 rob,右 notRob)。后序遍历一次。时间 O(n)，空间 O(h)（递归栈）。',
    en: 'LeetCode 337. Tree DP: each node returns [rob, notRob]. rob=val+left.notRob+right.notRob; notRob=max(left.rob,left.notRob)+max(right.rob,right.notRob). Postorder. Time O(n), space O(h).',
  },
  tags: ['dp', 'tree', 'leetcode', 'tree-dp'],
  complexity: { time: 'O(n)', space: 'O(h)' },
};
