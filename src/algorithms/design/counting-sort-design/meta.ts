// 计数排序设计 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'counting-sort-design',
  categoryId: 'design',
  title: { zh: '计数排序设计', en: 'Counting Sort Design' },
  summary: {
    zh: '值域 [0,k] 内计数频次，前缀和定位位置，反向回填保证稳定，O(n+k)。',
    en: 'Count frequencies over range [0,k], prefix-sum for positions, backfill in reverse for stability — O(n+k).',
  },
  description: {
    zh: '计数排序（Counting Sort）对值域为整数 [0, k] 的数组在 O(n+k) 完成排序，且可做到稳定：\n\n1. 统计每个值的出现次数到 `count[0..k]`\n2. 对 count 做前缀和，`count[v]` 此时表示「值 <= v 的元素个数」即 v 在输出中的最后位置\n3. **从后向前**扫描原数组：对每个 a[i]，把它放到输出 `out[--count[a[i]]]`，保证相同值的元素保留原相对顺序（稳定）\n\n适用条件：\n- 值域为整数且 k = O(n) 时高效（k 远大于 n 则空间浪费）\n- 稳定版常作为基数排序的子例程\n\n复杂度：时间 O(n+k)，空间 O(n+k)。',
    en: 'Counting Sort orders an array with integer values in range [0, k] in O(n+k), and can be made stable:\n\n1. Count occurrences of each value into `count[0..k]`\n2. Prefix-sum count so `count[v]` becomes "number of elements <= v" — the last position of v in output\n3. Scan the input **from right to left**: place each a[i] at `out[--count[a[i]]]`, preserving the relative order of equal elements (stability)\n\nApplicability:\n- Integer values with k = O(n) (wasteful if k ≫ n)\n- The stable variant is a subroutine of radix sort\n\nComplexity: time O(n+k), space O(n+k).',
  },
  tags: ['design', 'sorting', 'non-comparison', 'integer-sort'],
  complexity: { time: 'O(n + k)', space: 'O(n + k)' },
  attributes: { stable: 'true', 'in-place': 'false' },
};
