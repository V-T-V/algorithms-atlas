// 基数排序（MSD 十进制） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-radix-msd-dec',
  categoryId: 'sorting',
  title: { zh: '基数排序（MSD 十进制）', en: 'Radix Sort (MSD base-10)' },
  summary: {
    zh: '从最高位起递归地按十进制位分桶，桶内递归直到个位。',
    en: 'Recursively bucket by the most significant decimal digit first, recursing down to the units.',
  },
  description: {
    zh: '基数排序 MSD（最高位优先）从最高位起：按当前位（十进制）把元素分到 10 个桶，桶内递归处理下一位，直到最低位。与 LSD 不同，MSD 是递归的、按字典序的，天然得到全局有序。本实现递归版，对非负整数。时间 O(d*(n+10))，d 为最大位数。空间 O(n+10) 每层。稳定（桶内保持原序）。',
    en: 'Radix sort MSD (most-significant digit first) starts from the top digit: bucket elements by the current (decimal) digit into 10 buckets, recursively process the next digit within each bucket, down to the units. Unlike LSD, MSD is recursive and lexicographic, naturally producing global order. This recursive version handles non-negative integers. Time O(d*(n+10)), d = max digit count. Space O(n+10) per level. Stable (buckets preserve original order).',
  },
  tags: ['sorting', 'radix', 'non-comparison', 'recursive', 'integer'],
  complexity: { time: 'O(d*n)', space: 'O(n)' },
};
