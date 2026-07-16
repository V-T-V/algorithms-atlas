// 单词模式 II · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-word-pattern-2',
  categoryId: 'backtracking',
  title: { zh: '单词模式 II (LeetCode 291)', en: 'Word Pattern II' },
  summary: {
    zh: '回溯双射匹配 pattern 与 str，每个模式字母对应一个非空子串。',
    en: 'Backtrack a bijection between pattern letters and non-empty substrings of str.',
  },
  description: {
    zh: '为每个模式字符尝试不同长度的子串，维护 pattern→substr 与 substr→pattern 双射，冲突即剪枝。',
    en: 'Try substrings of varying length for each pattern char, maintaining a two-way bijection; prune on conflict.',
  },
  tags: ['backtracking', 'pattern', 'bijection'],
  complexity: { time: 'O(n^m)', space: 'O(m)' },
};
