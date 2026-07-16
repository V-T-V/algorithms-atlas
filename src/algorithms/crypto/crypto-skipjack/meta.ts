// Skipjack（Skipjack）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'crypto-skipjack',
  categoryId: 'crypto',
  title: { zh: 'Skipjack', en: 'Skipjack' },
  summary: {
    zh: 'Skipjack：NSA 设计 80 位密钥 32 轮，A/B 两类规则。',
    en: 'Skipjack: NSA-designed 80-bit-key 32-round cipher with Rule A/B.',
  },
  description: {
    zh: 'Skipjack（NSA，Clipper 芯片）80 位密钥，64 位分组，32 轮交替使用 Rule A（加密）与 Rule B（解密）。',
    en: 'Skipjack (NSA, Clipper chip): 80-bit key, 64-bit block, 32 rounds alternating Rule A (encrypt) and Rule B (decrypt).',
  },
  tags: ['crypto', 'skipjack', 'nsa', 'block'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
