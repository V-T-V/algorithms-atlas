// 排列硬币 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-arrange-coins',
  categoryId: 'misc',
  title: { zh: '排列硬币', en: 'Arranging Coins' },
  summary: {
    zh: 'n 枚硬币排成阶梯（第 k 行 k 枚），求能完整填满的行数（LeetCode 441）。',
    en: 'Arrange n coins in a staircase (k coins on row k); find the number of complete rows (LeetCode 441).',
  },
  description: {
    zh: 'LeetCode 441 排列硬币：\n\n- 第 1 行 1 枚，第 2 行 2 枚，...，第 k 行 k 枚。\n- 求 n 枚硬币最多完整填满几行。\n- 数学解：求最大 k 使 k(k+1)/2 <= n，即 k = floor((-1 + sqrt(1+8n)) / 2)。',
    en: 'LeetCode 441 Arranging Coins:\n\n- Row 1 has 1 coin, row 2 has 2, ..., row k has k.\n- Find the maximum complete rows from n coins.\n- Closed form: largest k with k(k+1)/2 <= n, i.e. k = floor((-1 + sqrt(1+8n)) / 2).',
  },
  tags: ['misc', 'math', 'binary-search', 'leetcode'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
