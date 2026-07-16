// 前导零计数变种 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bit-clz-2',
  categoryId: 'bitwise',
  title: { zh: '前导零计数（二分变种）', en: 'Count Leading Zeros (Binary Variant)' },
  summary: {
    zh: '二分法实现的 clz，返回最高位 1 之前的零个数。',
    en: 'Binary-search-based clz returning the number of leading zeros.',
  },
  description: {
    zh: '前导零计数（clz / Count Leading Zeros）返回 32 位整数最高位 1 之前的 0 的个数。\n\n本变种用二分：若高 16 位为 0，clz 至少 16，右移继续；否则保持高位。逐次按 16/8/4/2/1 位二分缩小。x == 0 时返回 32。\n\n复杂度 O(1)（固定位宽）。',
    en: 'Count Leading Zeros (clz) returns the number of zero bits before the most significant 1. This variant bisects the width (16/8/4/2/1). Returns 32 when x == 0. O(1) for fixed width.',
  },
  tags: ['bitwise', 'clz', 'binary-search'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
