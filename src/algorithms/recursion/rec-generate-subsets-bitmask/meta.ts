// 位掩码生成子集 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rec-generate-subsets-bitmask',
  categoryId: 'recursion',
  title: { zh: '位掩码生成子集', en: 'Subset Generation (Bitmask)' },
  summary: {
    zh: '递归枚举每个元素的「选/不选」位掩码，生成所有 2^n 个子集。',
    en: 'Recursively enumerate a choose/skip bitmask per element to generate all 2^n subsets.',
  },
  description: {
    zh: '生成子集（幂集）的递归方法：对每个元素，递归地分为「包含该元素」和「不包含」两条分支，形成二叉决策树，叶子节点对应一个子集。等价于枚举长度 n 的所有位掩码。共 2^n 个子集。本实现用回溯递归，维护当前路径，到达边界时记录一份子集。',
    en: 'A recursive way to generate subsets (the power set): for each element, branch into "include" and "exclude", forming a binary decision tree whose leaves correspond to subsets. This is equivalent to enumerating all length-n bitmasks. There are 2^n subsets in total. This implementation uses recursive backtracking, maintaining the current path and recording a subset at the boundary.',
  },
  tags: ['recursion', 'backtracking', 'subset', 'power-set', 'bitmask'],
  complexity: { time: 'O(2^n)', space: 'O(n)' },
};
