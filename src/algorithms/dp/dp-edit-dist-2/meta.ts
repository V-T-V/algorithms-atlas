import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-edit-dist-2',
  categoryId: 'dp',
  title: { zh: 'Damerau-Levenshtein 距离', en: 'Damerau-Levenshtein Distance' },
  summary: {
    zh: '带相邻交换的编辑距离：插入、删除、替换、转置四种操作。',
    en: 'Edit distance with adjacent transposition (insert/delete/substitute/swap).',
  },
  description: {
    zh: 'Damerau-Levenshtein 距离。允许插入、删除、替换、相邻两字符交换四种编辑操作，把 s1 变成 s2 的最小操作数。DP：dp[i][j] 为 s1[0..i) 与 s2[0..j) 的距离。当 s1[i-1]==s2[j-1] 时 dp[i][j]=dp[i-1][j-1]；否则取 1+min(删除 dp[i-1][j], 插入 dp[i][j-1], 替换 dp[i-1][j-1])；额外地若 i≥2,j≥2 且 s1[i-1]==s2[j-2] 且 s1[i-2]==s2[j-1]，可取 1+dp[i-2][j-2] 表示交换。时间 O(nm)，空间 O(nm)。',
    en: 'Damerau-Levenshtein distance: insert/delete/substitute + adjacent transposition. DP dp[i][j]; when chars match, copy diagonal; else 1+min of three; if swap condition holds, 1+dp[i-2][j-2]. Time O(nm), space O(nm).',
  },
  tags: ['dp', 'edit-distance', 'string', 'levenshtein'],
  complexity: { time: 'O(nm)', space: 'O(nm)' },
};
