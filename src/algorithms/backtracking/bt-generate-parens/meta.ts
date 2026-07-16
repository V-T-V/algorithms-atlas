// 括号生成 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-generate-parens',
  categoryId: 'backtracking',
  title: { zh: '括号生成', en: 'Generate Parentheses' },
  summary: {
    zh: '生成 n 对括号的所有合法组合。',
    en: 'All valid combinations of n pairs of parentheses.',
  },
  description: {
    zh: '回溯：open < n 加 (，close < open 加 )。',
    en: 'Backtrack with open<n and close<open. O(4^n/√n).',
  },
  tags: ['backtracking', 'parentheses'],
  complexity: { time: 'O(4^n / √n)', space: 'O(n)' },
};
