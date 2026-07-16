// TEA 完整版（TEA Full）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'crypto-tea-full',
  categoryId: 'crypto',
  title: { zh: 'TEA 完整版', en: 'TEA Full' },
  summary: {
    zh: 'TEA：32 轮 Feistel，加法 + 移位 + delta 常量。',
    en: 'TEA: 32-round Feistel with add + shift + delta constant.',
  },
  description: {
    zh: 'TEA（Wheeler & Needham 1994）64 位分组 128 位密钥，32 轮（= 64 周期），每轮加法+移位+密钥相加，使用 delta=0x9E3779B9 黄金分割常量。',
    en: 'TEA (Wheeler & Needham 1994): 64-bit block, 128-bit key, 32 rounds (= 64 cycles); each round uses add+shift+key-add with delta=0x9E3779B9 (golden ratio).',
  },
  tags: ['crypto', 'tea', 'feistel', 'block'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
