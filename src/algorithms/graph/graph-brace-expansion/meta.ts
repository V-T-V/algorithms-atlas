import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-brace-expansion',
  categoryId: 'graph',
  title: { zh: '花括号展开', en: 'Brace Expansion' },
  summary: {
    zh: '展开形如 {a,b}c{d,e} 的表达式为所有组合的字典序。',
    en: 'Expand an expression like {a,b}c{d,e} into all sorted combinations.',
  },
  description: {
    zh: 'LeetCode 1087。表达式由小写字母和花括号组成，花括号内是逗号分隔的若干选项（无嵌套）。展开为所有可能字符串，按字典序返回。例如 "a{b,c}d" → ["abd","acd"]。用回溯/笛卡尔积：把表达式解析成「块」序列，每块是单字母或一组选项；对选项排序后做笛卡尔积。时间 O(输出大小)，空间 O(输出大小)。',
    en: 'LeetCode 1087. An expression of lowercase letters and braces (comma-separated options, no nesting); expand into all strings sorted lexicographically. Parse into blocks (single char or option set), sort options, take the cartesian product. Time O(output size), space O(output size).',
  },
  tags: ['backtracking', 'string', 'cartesian-product', 'leetcode'],
  complexity: { time: 'O(2^k · k)', space: 'O(2^k · k)' },
};
