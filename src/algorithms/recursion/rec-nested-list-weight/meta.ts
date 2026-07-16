// 嵌套列表权重和 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rec-nested-list-weight',
  categoryId: 'recursion',
  title: { zh: '嵌套列表权重和 (I)', en: 'Nested List Weight Sum (I)' },
  summary: {
    zh: '递归求嵌套列表的深度权重和：每个整数乘以其所在深度后求和。',
    en: 'Recursively compute the depth-weighted sum of a nested list: each integer multiplied by its depth.',
  },
  description: {
    zh: '给定一个嵌套列表（元素是整数或更深的嵌套列表），求权重和：每个整数乘以其深度（最外层深度为 1，每深入一层 +1）后求和。例如 [[1,1],2,[1,1]] = 1·2+1·2+2·1+1·2+1·2 = 10。递归解法：dfs(list, depth) 对整数元素累加 value·depth，对列表元素递归 dfs(sublist, depth+1)。',
    en: 'Given a nested list (elements are integers or deeper nested lists), compute the weighted sum: each integer multiplied by its depth (outermost depth 1, +1 per level). E.g. [[1,1],2,[1,1]] = 1·2+1·2+2·1+1·2+1·2 = 10. Recursive solution: dfs(list, depth) accumulates value·depth for integers and recurses dfs(sublist, depth+1) for lists.',
  },
  tags: ['recursion', 'nested-list', 'depth', 'tree'],
  complexity: { time: 'O(n)', space: 'O(d)' },
};
