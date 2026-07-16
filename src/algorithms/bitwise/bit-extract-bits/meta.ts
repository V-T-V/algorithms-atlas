// 位提取（PEXT）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bit-extract-bits',
  categoryId: 'bitwise',
  title: { zh: '位提取（PEMT）', en: 'Bit Extract (PEXT)' },
  summary: {
    zh: '把掩码 m 为 1 的位置上的 x 位「压缩」到低位连续。',
    en: 'Gather the bits of x at positions where mask m is 1, packed contiguously in the low bits.',
  },
  description: {
    zh: '位提取（即 BMI2 的 PEXT 操作的纯软件实现）：\n\n扫描掩码 m 的每一位；每当遇到 m 的 1 位，就取 x 的对应位并按顺序填入结果的低位。\n\n```\nresult = 0; j = 0\nfor i in 0..31:\n  if (m >> i) & 1:\n    result |= ((x >> i) & 1) << j\n    j += 1\n```\n\n与 bit-deposit-bits 互为逆运算。复杂度 O(1)（固定位宽）。',
    en: 'Bit extract (software PEXT, equivalent to BMI2 PEXT): scans mask m bit-by-bit; for each set bit of m, copies the corresponding bit of x into the next low bit of the result. Inverse of bit-deposit-bits. O(1) for fixed width.',
  },
  tags: ['bitwise', 'pext', 'gather', 'mask'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
