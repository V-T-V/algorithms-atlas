// 计数排序（带负数偏移） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-counting-offset',
  categoryId: 'sorting',
  title: { zh: '计数排序（带负数偏移）', en: 'Counting Sort (Negative Offset)' },
  summary: {
    zh: '通过值偏移把负数也纳入计数排序的非负桶范围。',
    en: 'Counting sort that supports negative values by offsetting them into a non-negative bucket range.',
  },
  description: {
    zh: '计数排序（Counting Sort）统计每个值出现次数，前缀和后回填，对值域 k 内的整数 O(n+k)。标准版只支持非负键，本实现先扫描得到最小值 min，把所有键减去 min 偏移到 [0, max-min]，计数回填后再无需调整（偏移只影响桶索引，回填时用原值）。支持负整数。稳定（回填时倒序）。空间 O(k)。',
    en: 'Counting sort tallies occurrences of each value, prefix-sums, then writes back, giving O(n+k) for integers in a value range k. The standard version only supports non-negative keys; this implementation first scans for the minimum and offsets all keys by -min into [0, max-min], supporting negative integers. Stable (write-back in reverse). Space O(k).',
  },
  tags: ['sorting', 'counting', 'non-comparison', 'stable', 'integer'],
  complexity: { time: 'O(n+k)', space: 'O(k)' },
};
