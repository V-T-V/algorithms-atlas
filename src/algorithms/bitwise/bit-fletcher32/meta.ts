// Fletcher-32 校验 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bit-fletcher32',
  categoryId: 'bitwise',
  title: { zh: 'Fletcher-32 校验', en: 'Fletcher-32 Checksum' },
  summary: {
    zh: '把字节序列当作 16 位字，用两个对 65535 取模的累加和构造 32 位校验。',
    en: 'Compute a 32-bit checksum via two running sums modulo 65535 over 16-bit words.',
  },
  description: {
    zh: 'Fletcher-32 校验：维护两个累加和 s1、s2（均模 65535）。把输入按 16 位字（小端）处理，每字：\n\n```\ns1 = (s1 + word) mod 65535\ns2 = (s2 + s1) mod 65535\n```\n\n初始 s1 = s2 = 0xFFFF。结果 = (s2 << 16) | s1。\n\n相比简单求和，s2 让位置变化也能被检出。复杂度 O(n)。',
    en: 'Fletcher-32 maintains two sums s1, s2 (mod 65535) over 16-bit little-endian words: s1 += word; s2 += s1, both mod 65535; result = (s2<<16)|s1. s2 makes the checksum sensitive to bit position. O(n).',
  },
  tags: ['bitwise', 'fletcher', 'checksum', 'error-detection'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
