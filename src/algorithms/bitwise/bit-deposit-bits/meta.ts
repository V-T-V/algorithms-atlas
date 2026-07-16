// 位放置（PDEP）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bit-deposit-bits',
  categoryId: 'bitwise',
  title: { zh: '位放置（PDEP）', en: 'Bit Deposit (PDEP)' },
  summary: {
    zh: '把 x 的低位「散布」到掩码 m 为 1 的位置。',
    en: 'Scatter the low bits of x into the positions where mask m is 1.',
  },
  description: {
    zh: '位放置（即 BMI2 的 PDEP 操作的纯软件实现）：\n\n扫描掩码 m 的每一位；每当遇到 m 的 1 位，就按顺序从 x 的最低位取一位放到该位置。\n\n```\nresult = 0; j = 0\nfor i in 0..31:\n  if (m >> i) & 1:\n    result |= ((x >> j) & 1) << i\n    j += 1\n```\n\n与 bit-extract-bits 互为逆运算。复杂度 O(1)。',
    en: 'Bit deposit (software PDEP, equivalent to BMI2 PDEP): scans mask m bit-by-bit; for each set bit of m, copies the next low bit of x into that position. Inverse of bit-extract-bits. O(1) for fixed width.',
  },
  tags: ['bitwise', 'pdep', 'scatter', 'mask'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
