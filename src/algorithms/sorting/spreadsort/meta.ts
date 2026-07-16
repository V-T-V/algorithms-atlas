// Spread 排序 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'spreadsort',
  categoryId: 'sorting',
  title: { zh: 'Spread 排序', en: 'Spread Sort' },
  summary: {
    zh: '基于位/分布的桶划分 + 小桶比较排序的混合排序。',
    en: 'Hybrid sort: distribution-based bucketing plus comparison-based cleanup.',
  },
  description: {
    zh:
      'Spread 排序（Spreadsort）是 Steven J. Ross 等人提出的混合排序：' +
      '\n- 类似基数排序，但按「值域分段」而非逐位划分：根据当前段的最大值位数（log2 范围）' +
      '选若干高位作为桶键，元素落入 [0, buckets) 个桶。' +
      '\n- 桶元素过少（< 阈值）时直接用比较排序（插入）收尾；否则递归 spread 排序。' +
      '\n- 结合了基数排序（分布）的线性潜力与快速排序（比较）的通用性，' +
      '实测对整数常优于 std::sort。' +
      '\n平均 `O(n·(b/r))`，其中 b 为位宽、r 为每轮处理位数；最坏 `O(n log n)`。',
    en:
      'Spread Sort, by Steven J. Ross et al., is a hybrid: ' +
      '\n- Like radix sort but bins by value-range segments rather than bit-by-bit: based on the ' +
      'bit width (log2 range) of the current segment, use a few high bits as the bucket key. ' +
      '\n- Tiny buckets (< threshold) fall back to comparison sort (insertion); larger ones recurse. ' +
      '\n- Combines the linear potential of distribution sorts with the generality of comparison sorts; ' +
      'often beats std::sort on integer keys. ' +
      'Average O(n·(b/r)) where b is bit width, r bits per pass; worst O(n log n).',
  },
  tags: ['sorting', 'hybrid', 'distribution', 'comparison-fallback', 'integer'],
  complexity: { time: 'O(n·⌈b/r⌉)', space: 'O(n)' },
};
