// 字符串拼接最小表示 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'greedy-patch-string',
  categoryId: 'greedy',
  title: { zh: '字符串拼接最小表示', en: 'Smallest Concatenation' },
  summary: {
    zh: '贪心排序把一组字符串拼成字典序最小的结果。',
    en: 'Greedily sort a set of strings to concatenate into the lexicographically smallest result.',
  },
  description: {
    zh: '自定义比较：a 与 b 谁在前更小取决于 a+b 与 b+a 的字典序。按此排序后拼接。',
    en: 'Custom comparator: order a before b iff a+b < b+a lexicographically; concatenate after sorting.',
  },
  tags: ['greedy', 'string', 'sorting'],
  complexity: { time: 'O(n·k·log n)', space: 'O(n·k)' },
};
