// 快乐数 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'misc-happy-2',
  categoryId: 'misc',
  title: { zh: '快乐数', en: 'Happy Number' },
  summary: {
    zh: '反复把 n 替换为各位平方和，最终为 1 是快乐数，否则进入循环。',
    en: 'Replace n with the sum of squared digits repeatedly; reaches 1 = happy, else loops.',
  },
  description: {
    zh: 'LeetCode 202 快乐数：用快慢指针检测是否最终到 1，避免无穷循环。',
    en: 'LeetCode 202 Happy Number: use fast/slow pointers to detect whether n reaches 1 without infinite loop.',
  },
  tags: ['misc', 'math', 'two-pointers', 'leetcode'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
