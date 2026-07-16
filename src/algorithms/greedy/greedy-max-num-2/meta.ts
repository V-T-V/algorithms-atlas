// 拼接最大数 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'greedy-max-num-2',
  categoryId: 'greedy',
  title: { zh: '拼接最大数', en: 'Largest Number' },
  summary: {
    zh: '把一组数拼成最大字符串：按 xy vs yx 字典序降序排。',
    en: 'Concatenate numbers into the largest string; sort by xy-vs-yx lexicographic order.',
  },
  description: {
    zh: 'LeetCode 179 最大数：给一组非负整数，把它们排列拼接成最大的字符串。自定义比较：a 在 b 前当且仅当 ab > ba。',
    en: 'LeetCode 179 Largest Number: arrange non-negative integers to form the largest string. Custom compare: a before b iff ab > ba.',
  },
  tags: ['greedy', 'leetcode'],
  complexity: { time: 'O(n log n · L)', space: 'O(n)' },
};
