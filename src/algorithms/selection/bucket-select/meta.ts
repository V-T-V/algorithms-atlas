// 桶选择（Bucket Select）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bucket-select',
  categoryId: 'selection',
  title: { zh: '桶选择（均匀分布）', en: 'Bucket Select (Uniform)' },
  summary: {
    zh: '在均匀分布假设下，把元素分桶后在目标桶内递归选第 k 小。',
    en: 'Under uniform-distribution assumption, scatter into buckets and recurse into the target bucket.',
  },
  description: {
    zh: '桶选择是桶排序的「半成品」版：先扫描出 [min, max] 区间，把每个元素按值落入对应桶（桶数约为 n），统计每桶大小后定位第 k 小所在的桶；桶内递归继续选择。\n\n- 桶数 B 约为 n\n- 元素 a[i] 落桶 floor((a[i]-min)/(max-min) * B)\n- 按桶大小累加定位第 k 小所在桶 b\n- 在桶 b 内的相对排名 k2 = k 减去桶 0..b-1 的大小之和\n- 递归到桶内元素很少时直接排序取值\n\n均匀分布下期望 O(n)。',
    en: 'Bucket select is "half" of bucket sort: scan [min,max], scatter each value into a bucket (B≈n), accumulate bucket sizes to locate the bucket holding rank-k, then recurse with adjusted rank inside that bucket. Expected O(n) for uniform distributions.',
  },
  tags: ['selection', 'bucket', 'distribution', 'divide-and-conquer'],
  complexity: { time: 'O(n) 期望', space: 'O(n)' },
};
