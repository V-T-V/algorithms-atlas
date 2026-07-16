// 按字节反转 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bitwise-reverse-bytes',
  categoryId: 'bitwise',
  title: { zh: '按字节反转位序', en: 'Reverse Bits by Bytes' },
  summary: {
    zh: '用 256 项查表对每个字节做位反转，再拼接成整体反转。',
    en: 'Reverse bits of each byte via a 256-entry lookup table, then concatenate.',
  },
  description: {
    zh:
      '按字节反转位序（Reverse Bits by Bytes）：把一个整数的二进制位顺序反转（最高位 ↔ 最低位等）。' +
      '\n优化做法：预生成 256 项「单字节位反转表」，然后对整数的每个字节查表，' +
      '再把结果按相反顺序拼接。' +
      '\n- 例：`0b11010000` 反转为 `0b00001011`。' +
      '\n- 对 32 位整数需查表 4 次，时间 `O(1)`（固定位宽），空间 `O(256)`。',
    en:
      'Reverse bits by bytes: reverse the bit order of an integer (MSB ↔ LSB etc.). ' +
      '\nOptimized approach: precompute a 256-entry per-byte reversal table, then look up each byte ' +
      'and concatenate results in reverse order. ' +
      '\n- E.g. 0b11010000 → 0b00001011. ' +
      '\n- A 32-bit integer needs 4 lookups; O(1) for fixed width, space O(256).',
  },
  tags: ['bitwise', 'reverse', 'lookup-table', 'byte'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
