// 位合并 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bit-merge-bits',
  categoryId: 'bitwise',
  title: { zh: '位合并', en: 'Bit Merge' },
  summary: {
    zh: '按掩码 m 合并 x 与 y 的位：结果位取自 y（m=1）或 x（m=0）。',
    en: 'Merge bits of x and y by mask m: result bit from y where m=1, from x where m=0.',
  },
  description: {
    zh: '位合并（bit merge / blend）：\n\n```\nresult = (x & ~m) | (y & m)\n```\n\n直观理解：掩码 m 决定每一位「从哪个源取」——m 的 1 位取 y，m 的 0 位取 x。\n\n这是位运算的基本组合操作，常用于 SIMD blend、条件位写入等。复杂度 O(1)。',
    en: 'Bit merge (blend): result = (x & ~m) | (y & m). The mask m selects each bit from y (m=1) or x (m=0). A fundamental bit-composition primitive used in SIMD blend and conditional bit writes. O(1).',
  },
  tags: ['bitwise', 'merge', 'blend', 'mask'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
