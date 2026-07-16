import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-edit-dist-3',
  categoryId: 'dp',
  title: { zh: '编辑距离（带操作回溯）', en: 'Edit Distance with Backtrack' },
  summary: {
    zh: '求两串的 Levenshtein 距离并回溯出最少编辑操作序列。',
    en: 'Levenshtein distance plus the actual edit operations via backtracking.',
  },
  description: {
    zh: 'LeetCode 72。经典 DP：dp[i][j] = s1[0..i-1] 与 s2[0..j-1] 的编辑距离。若末字符相同则 dp[i-1][j-1]；否则 1 + min(替换/删除/插入)。本实现额外记录选择来源，回溯得到「保留/替换/删除/插入」的操作序列。',
    en: 'Classic DP for Levenshtein; we additionally store back-pointers to reconstruct the actual keep/replace/delete/insert operation list.',
  },
  tags: ['dp', 'edit-distance', 'backtrack'],
  complexity: { time: 'O(nm)', space: 'O(nm)' },
};
