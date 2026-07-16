// Z 字形变换 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'misc-zigzag',
  categoryId: 'misc',
  title: { zh: 'Z 字形变换', en: 'Zigzag Conversion' },
  summary: {
    zh: '把字符串按 Z 字形写入 r 行，再按行读出。',
    en: 'Write the string in a zigzag across r rows, then read row by row.',
  },
  description: {
    zh: 'LeetCode 6 Z 字形变换：把字符串按从上到下、再斜向上的方式写入 r 行，最后按行拼接。',
    en: 'LeetCode 6 Zigzag Conversion: write characters in a down-then-diagonal-up pattern across r rows, then concatenate rows.',
  },
  tags: ['misc', 'string', 'leetcode'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
