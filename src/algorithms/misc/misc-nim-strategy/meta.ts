// Nim 取胜策略（Nim Winning Strategy）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-nim-strategy',
  categoryId: 'misc',
  title: { zh: 'Nim 取胜策略', en: 'Nim Winning Strategy' },
  summary: {
    zh: 'Nim 和非零时取若干使 Nim 和变零，先手必胜。',
    en: 'When nim-sum is nonzero, remove stones to make it zero; first player wins.',
  },
  description: {
    zh: 'Nim 策略：nimSum=Σ堆^异或。若非 0，找一堆使其与 nimSum 异或后变小，取差量使 nimSum 归 0。',
    en: 'Nim strategy: nimSum=XOR of piles. If nonzero, pick a pile whose XOR with nimSum is smaller, take the diff.',
  },
  tags: ['misc', 'game-theory', 'bitwise'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
