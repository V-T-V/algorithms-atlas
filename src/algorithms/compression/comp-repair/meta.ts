// Re-Pair 递归配对（Re-Pair Compression）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'comp-repair',
  categoryId: 'compression',
  title: { zh: 'Re-Pair 递归配对', en: 'Re-Pair Compression' },
  summary: { zh: '递归替换最频繁相邻对为新符号。', en: 'Recursively replace most frequent pair.' },
  description: {
    zh: 'Re-Pair(Larsson & Moffat)反复用新符号替换序列中最频繁的相邻符号对，直到没有对出现 ≥2 次，得到紧凑语法。',
    en: 'Re-Pair recursively replaces the most frequent adjacent pair with a new symbol until no pair repeats, producing a compact grammar.',
  },
  tags: ['compression', 'repair', 'grammar'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
