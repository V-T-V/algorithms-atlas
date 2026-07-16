import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-edit-4',
  categoryId: 'dp',
  title: { zh: '编辑距离（Levenshtein）', en: 'Edit Distance (Levenshtein)' },
  summary: {
    zh: '把字符串 a 变成 b 的最少插入/删除/替换次数。',
    en: 'Minimum insert/delete/replace ops to transform a into b.',
  },
  description: {
    zh: 'dp[i][j] = a前i 变 b前j 的最少操作。若字符相等则 dp[i-1][j-1]；否则 1 + min(替换, 删除, 插入)。',
    en: 'dp[i][j] = min ops to convert first i of a to first j of b. If equal, diagonal; else 1+min of sub/del/ins.',
  },
  tags: ['dp', 'edit-distance', 'string'],
  complexity: { time: 'O(n*m)', space: 'O(n*m)' },
};
