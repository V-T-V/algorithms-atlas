// 有效完全平方数 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-valid-square',
  categoryId: 'misc',
  title: { zh: '有效完全平方数', en: 'Valid Perfect Square' },
  summary: {
    zh: '判定 num 是否是完全平方数（不使用 sqrt 库函数），二分法（LeetCode 367）。',
    en: 'Check if num is a perfect square without library sqrt, via binary search (LeetCode 367).',
  },
  description: {
    zh: 'LeetCode 367 有效的完全平方数：\n\n- 给定正整数 num，判断是否存在整数 x 使 x*x == num。\n- 二分查找：lo=1, hi=num，每次取 mid 比较 mid*mid 与 num。\n- 注意大数溢出用除法判定：mid == num/mid && num%mid == 0。',
    en: 'LeetCode 367 Valid Perfect Square:\n\n- Given positive num, decide if some integer x satisfies x*x == num.\n- Binary search: lo=1, hi=num, compare mid*mid with num.\n- To avoid overflow, use division: mid == num/mid && num%mid == 0.',
  },
  tags: ['misc', 'binary-search', 'math', 'leetcode'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
