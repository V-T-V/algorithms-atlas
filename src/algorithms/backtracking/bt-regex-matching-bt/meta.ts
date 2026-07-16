// 正则匹配回溯 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-regex-matching-bt',
  categoryId: 'backtracking',
  title: { zh: '正则匹配（回溯）', en: 'Regex Matching (Backtracking)' },
  summary: {
    zh: '回溯实现支持 . 与 * 的正则匹配（LeetCode 10）。',
    en: 'Backtracking regex matching supporting . and * (LeetCode 10).',
  },
  description: {
    zh: '逐字符匹配，遇到 x* 时分两种选择：匹配一个 x 后继续保留 x*，或丢弃 x*。',
    en: 'Match char by char; at x* choose either to match one x and keep x*, or drop x*.',
  },
  tags: ['backtracking', 'string', 'regex'],
  complexity: { time: 'O((m+n)·2^m)', space: 'O(m)' },
};
