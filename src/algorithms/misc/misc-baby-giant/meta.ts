// 小步大步离散对数（Baby-Step Giant-Step）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-baby-giant',
  categoryId: 'misc',
  title: { zh: '小步大步离散对数', en: 'Baby-Step Giant-Step' },
  summary: {
    zh: '求 a^x ≡ b mod p 的最小 x，用 sqrt(p) 空间换时间。',
    en: 'Find smallest x with a^x ≡ b mod p using sqrt(p) space-time tradeoff.',
  },
  description: {
    zh: 'BSGS：baby 集 {a^0..a^(m-1)}，giant 步查 b·a^{-jm} 是否在 baby 集。O(√p)。',
    en: 'BSGS: baby set {a^0..a^(m-1)}, giant steps check b·a^{-jm} against baby set. O(sqrt p).',
  },
  tags: ['misc', 'number-theory', 'discrete-log'],
  complexity: { time: 'O(√p)', space: 'O(√p)' },
};
