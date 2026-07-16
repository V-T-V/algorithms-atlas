// Longest Common Prefix · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'longest-common-prefix-impl',
  categoryId: 'string',
  title: { zh: '最长公共前缀（多串）', en: 'Longest Common Prefix (Multi-string)' },
  summary: {
    zh: '纵向扫描多个字符串同一列字符，遇分歧即止，返回公共前缀。',
    en: 'Scans the same column across all strings; stops at the first diverging character.',
  },
  description: {
    zh: '最长公共前缀（Longest Common Prefix，多串版）：给定一组字符串，找出它们最长的公共前缀。例如 ["flower","flow","flight"] 的公共前缀是 "fl"。\n\n采用**纵向扫描**：取第一个串作基准，依次比较每个位置 i 上所有串的第 i 个字符是否都相同；遇到某串长度不足或字符不等即返回前 i 个字符。时间 O(S)（S = 所有串字符总数），空间 O(1)（不含输出）。\n\n另一思路是「分治 / 二分」，但纵向扫描最简洁、常数最小。',
    en: 'Longest Common Prefix (multi-string): find the longest prefix shared by a set of strings. E.g. ["flower","flow","flight"] → "fl".\n\nUsing **vertical scanning**: take the first string as a reference, and for each column i check whether every string has the same i-th character; stop as soon as one string is too short or differs, returning the first i characters. Time O(S) (S = total characters across all strings), space O(1) (excluding output).\n\nAlternatives include divide-and-conquer or binary search, but vertical scanning is the simplest and has the smallest constant.',
  },
  tags: ['string', 'prefix', 'multi-string', 'vertical-scan'],
  complexity: { time: 'O(S)', space: 'O(1)' },
};
