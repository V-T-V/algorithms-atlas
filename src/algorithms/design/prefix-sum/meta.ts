// Prefix Sum · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'prefix-sum',
  categoryId: 'design',
  title: { zh: '前缀和', en: 'Prefix Sum' },
  summary: {
    zh: '预处理前缀和数组，O(1) 回答任意区间求和。',
    en: 'Precompute a prefix sum array for O(1) range-sum queries.',
  },
  description: {
    zh: '前缀和（Prefix Sum）是最经典的「空间换时间」设计范式：\n\n- 预处理：`prefix[0]=0`，`prefix[i+1] = prefix[i] + a[i]`，得前缀和数组 `prefix[0..n]`。\n- 查询：区间 `[l, r]`（左闭右闭）的和 = `prefix[r+1] - prefix[l]`，O(1) 完成。\n\n适合「静态数组 + 多次区间求和」场景。构建 O(n)，每次查询 O(1)。二维前缀和可推广到子矩阵求和。本实现通过钩子暴露构建与查询过程，便于可视化。',
    en: 'Prefix sum is the classic "trade space for time" design paradigm:\n\n- Preprocess: `prefix[0]=0`, `prefix[i+1] = prefix[i] + a[i]`, yielding `prefix[0..n]`.\n- Query: the sum of range `[l, r]` (inclusive) = `prefix[r+1] - prefix[l]`, in O(1).\n\nIdeal for "static array + many range-sum queries." Build is O(n), each query O(1). Generalizes to 2D prefix sums for submatrix sums. Hooks expose the build and query processes for visualization.',
  },
  tags: ['design', 'prefix-sum', 'preprocessing'],
  complexity: { time: 'O(n) 预处理 / O(1) 查询', space: 'O(n)' },
};
