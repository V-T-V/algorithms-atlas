// 桶排序设计 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bucket-sort-design',
  categoryId: 'design',
  title: { zh: '桶排序设计', en: 'Bucket Sort Design' },
  summary: {
    zh: '把元素按值域分到 k 个桶，桶内排序后顺序合并，均匀输入下期望 O(n)。',
    en: 'Distribute elements into k buckets by value range, sort each, then concatenate; expected O(n) on uniform input.',
  },
  description: {
    zh: '桶排序（Bucket Sort）适合「值域已知且分布较均匀」的浮点/整数排序：\n\n1. 创建 k 个空桶\n2. 把每个元素 v 放进桶 `floor((v - min) / (max - min) * k)`（注意边界）\n3. 对每个非空桶内部排序（通常插入排序，桶内元素少）\n4. 顺序拼接各桶\n\n复杂度：\n- 输入均匀分布时，每桶元素期望 O(n/k)，桶内排序 O((n/k) log(n/k))，总计 O(n log(n/k))；k≈n 时为期望 O(n)\n- 最坏（全挤一个桶）O(n log n)\n- 空间 O(n)\n\n稳定性：桶内排序稳定则整体稳定。',
    en: 'Bucket Sort suits sorting floats/integers with a known, fairly uniform range:\n\n1. Create k empty buckets\n2. Put each value v into bucket `floor((v - min) / (max - min) * k)` (mind the edge)\n3. Sort each non-empty bucket (usually insertion sort, since buckets are small)\n4. Concatenate buckets in order\n\nComplexity:\n- On uniform input each bucket holds O(n/k) in expectation; per-bucket sort O((n/k) log(n/k)); total O(n log(n/k)); with k≈n, expected O(n)\n- Worst case (all in one bucket) O(n log n)\n- Space O(n)\n\nStability: stable if the per-bucket sort is stable.',
  },
  tags: ['design', 'sorting', 'distribution', 'non-comparison'],
  complexity: { time: 'O(n + k) avg', space: 'O(n + k)' },
  attributes: { stable: 'true', 'in-place': 'false' },
};
