import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-house-robber-5',
  categoryId: 'dp',
  title: { zh: '打家劫舍 III（树形）', en: 'House Robber III (Tree DP)' },
  summary: {
    zh: '房屋排成二叉树，相邻父子不能同抢，求能偷到的最大金额。',
    en: 'Houses arranged in a binary tree; cannot rob both parent and child. Maximize loot.',
  },
  description: {
    zh: 'LeetCode 337。对每个节点返回 [rob, notRob]：rob = v + 左.notRob + 右.notRob；notRob = max(左.rob,左.notRob) + max(右.rob,右.notRob)。后序遍历一次。',
    en: 'LC 337. Each node returns [rob, notRob]; rob=node.val+children notRob; notRob=sum of max(child.rob, child.notRob). Post-order traversal.',
  },
  tags: ['dp', 'tree-dp', 'house-robber'],
  complexity: { time: 'O(n)', space: 'O(h)' },
};
