// 基数排序（LSD 十六进制） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-radix-lsd-hex',
  categoryId: 'sorting',
  title: { zh: '基数排序（LSD 十六进制）', en: 'Radix Sort (LSD base-16)' },
  summary: {
    zh: '以 16 为基数按位 LSD 基数排序，每趟 16 个桶，趟数为 hex 位数。',
    en: 'LSD radix sort with base 16; 16 buckets per pass, passes = number of hex digits.',
  },
  description: {
    zh: '基数排序（Radix Sort）LSD（最低位优先）从最低位起，逐位用稳定计数排序分配到桶再合并。本实现以 16（hex）为基数：每趟 16 个桶，按 4 位一组提取位掩码，趟数等于最大值的十六进制位数。对 32 位整数最多 8 趟。时间 O(d*(n+16))，d 为位数；空间 O(n+16)。稳定，非原地，适合整数。',
    en: 'Radix sort LSD (least-significant digit first) applies a stable counting sort digit by digit from the lowest. This variant uses base 16 (hex): 16 buckets per pass, masking 4 bits at a time, with passes equal to the number of hex digits of the maximum (at most 8 for 32-bit integers). Time O(d*(n+16)), space O(n+16). Stable, not in-place; ideal for integers.',
  },
  tags: ['sorting', 'radix', 'non-comparison', 'stable', 'integer'],
  complexity: { time: 'O(d*n)', space: 'O(n)' },
};
