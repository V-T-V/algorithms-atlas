// 半字节交换 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bitwise-swap-nibbles',
  categoryId: 'bitwise',
  title: { zh: '半字节（高低 4 位）交换', en: 'Swap Nibbles' },
  summary: {
    zh: '把一个字节的低 4 位与高 4 位互换：((x & 0x0F)<<4) | ((x & 0xF0)>>4)。',
    en: 'Swap the low and high 4-bit nibbles of a byte: ((x & 0x0F)<<4) | ((x & 0xF0)>>4).',
  },
  description: {
    zh:
      '半字节交换（Swap Nibbles）：对一个 8 位字节，把其低 4 位（nibble）与高 4 位互换。' +
      '\n核心技巧只用两步掩码 + 移位：' +
      '\n- 低半字节上移：`(x & 0x0F) << 4`' +
      '\n- 高半字节下移：`(x & 0xF0) >> 4`' +
      '\n- 二者按位或即结果。' +
      '\n应用：BCD 码与二进制互转、字节加密变换、生成「反转高半字节」等趣味编码。' +
      '\n时间 `O(1)`，空间 `O(1)`。',
    en:
      'Swap Nibbles: exchange the low 4-bit nibble and the high 4-bit nibble of a byte. ' +
      '\nTwo mask-and-shift steps: ' +
      '\n- low nibble up: (x & 0x0F) << 4 ' +
      '\n- high nibble down: (x & 0xF0) >> 4 ' +
      '\n- OR them for the result. ' +
      '\nApplications: BCD↔binary conversion, byte cipher transforms, fun encodings. ' +
      '\nTime O(1), space O(1).',
  },
  tags: ['bitwise', 'nibble', 'swap', 'bcd'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
