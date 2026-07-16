// 汉明距离 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bit-hamming-distance',
  categoryId: 'bitwise',
  title: { zh: '汉明距离', en: 'Hamming Distance' },
  summary: {
    zh: '两个等长整数二进制表示中，对应位不同的位数（即异或后的 popcount）。',
    en: 'Number of bit positions where two integers differ (popcount of their XOR).',
  },
  description: {
    zh: '汉明距离衡量两个等长比特串的差异程度：对应位不同的位数。\n\n计算方法：\n```\nd = x XOR y   // 不同的位变 1\n返回 popcount(d)\n```\n\n用 Kernighan 法（d & (d-1)）逐位清除统计 1 的个数。\n\n汉明距离广泛用于编码理论、纠错码、信息检索。复杂度 O(k)，k 为不同的位数。',
    en: 'Hamming distance counts bit positions where two integers differ: d = x XOR y, then popcount(d) via Kernighan (d &= d-1). Used in coding theory, error-correcting codes, and information retrieval. O(k) where k = differing bits.',
  },
  tags: ['bitwise', 'hamming', 'distance', 'xor'],
  complexity: { time: 'O(k)', space: 'O(1)' },
};
