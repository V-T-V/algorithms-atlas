// 快乐数计数 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-happy-number-count',
  categoryId: 'misc',
  title: { zh: '快乐数计数', en: 'Happy Number Count' },
  summary: {
    zh: '统计 1..n 中快乐数的个数：反复平方求和到 1 即快乐（LeetCode 202）。',
    en: 'Count happy numbers in 1..n: a number is happy if repeated digit-square-sum reaches 1 (LeetCode 202).',
  },
  description: {
    zh: '快乐数计数（基于 LeetCode 202）：\n\n- 快乐数：反复把各位平方求和，最终到达 1。\n- 不快乐数会进入含 4 的循环（1→...→4→16→37→...→4）。\n- 用集合/快慢指针检测循环。\n- 统计 1..n 中快乐数的个数。',
    en: 'Happy number count (based on LeetCode 202):\n\n- A happy number: repeatedly sum the squares of digits to eventually reach 1.\n- Unhappy numbers enter a cycle containing 4 (1→...→4→16→37→...→4).\n- Detect cycles with a set or fast/slow pointers.\n- Count happy numbers in 1..n.',
  },
  tags: ['misc', 'set', 'number-theory', 'leetcode'],
  complexity: { time: 'O(n · L)', space: 'O(L)' },
};
