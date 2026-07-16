// 整数替换 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-integer-replacement',
  categoryId: 'misc',
  title: { zh: '整数替换', en: 'Integer Replacement' },
  summary: {
    zh: '把 n 变成 1 的最少操作：偶数除 2，奇数 +1 或 -1（LeetCode 397）。',
    en: 'Minimum operations to reduce n to 1: even divide by 2, odd add/subtract 1 (LeetCode 397).',
  },
  description: {
    zh: 'LeetCode 397 整数替换：\n\n- 若 n 偶：n /= 2，一次操作。\n- 若 n 奇：n+1 或 n-1，一次操作。\n- 求 n → 1 的最少操作数。\n\n关键优化：奇数 n % 4 == 1 时 -1 更优；n % 4 == 3 且 n != 3 时 +1 更优（让更多位变 0 加速除 2）。',
    en: 'LeetCode 397 Integer Replacement:\n\n- If n even: n /= 2, one operation.\n- If n odd: n+1 or n-1, one operation.\n- Find minimum operations n → 1.\n\nKey optimization: when n % 4 == 1, -1 is better; when n % 4 == 3 and n != 3, +1 is better (more zero bits, faster halving).',
  },
  tags: ['misc', 'greedy', 'bit-manipulation', 'leetcode'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
