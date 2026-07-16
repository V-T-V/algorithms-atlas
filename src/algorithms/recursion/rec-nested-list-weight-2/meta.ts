// 嵌套列表权重和 II · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rec-nested-list-weight-2',
  categoryId: 'recursion',
  title: { zh: '嵌套列表权重和 II (反向深度)', en: 'Nested List Weight Sum II (Inverse Depth)' },
  summary: {
    zh: '递归求反向深度权重和：越深的整数权重越大（权重 = 最大深度 - 当前深度 + 1）。',
    en: 'Recursively compute the inverse depth-weighted sum: deeper integers get larger weight (weight = maxDepth - depth + 1).',
  },
  description: {
    zh: '与权重和 I 相反：这里越深的整数权重越大。权重 = (最大深度 - 该整数所在深度 + 1)。例如 [[1,1],2,[1,1]]，最大深度 2：深度 1 的 2 权重 1，深度 2 的四个 1 权重 2，结果 = 2·1 + 1·2·4 = 8。两遍递归：先递归求最大深度，再递归按反向权重求和。',
    en: 'The opposite of Weight Sum I: deeper integers get larger weight. Weight = (maxDepth - depth + 1). For [[1,1],2,[1,1]] with maxDepth 2: the depth-1 integer 2 has weight 1, the four depth-2 ones have weight 2, so the result = 2·1 + 1·2·4 = 8. Two recursive passes: first find max depth, then sum with inverse weights.',
  },
  tags: ['recursion', 'nested-list', 'inverse-depth', 'two-pass'],
  complexity: { time: 'O(n)', space: 'O(d)' },
};
