// CYK Parser · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'cyk-parser',
  categoryId: 'parsing',
  title: { zh: 'CYK 算法', en: 'CYK Parser' },
  summary: {
    zh: 'CNF 文法下自底向上二维 DP，判断输入串是否可推导。',
    en: 'Bottom-up 2-D dynamic programming under a CNF grammar to decide if a string is derivable.',
  },
  description: {
    zh: 'Cocke–Younger–Kasami（CYK）算法在 Chomsky 范式（CNF）文法下用动态规划判断输入串能否由文法推导。CNF 规定产生式只能是 A → BC（两非终结符）或 A → a（单终结符）。对长度为 n 的输入构造 n×n 上三角表：cell[i][j] 存放能推导出子串 s[i..i+len-1] 的非终结符集合。按子串长度从小到大填表，每格枚举切分点 k，合并 A→BC 的左部。最终检查起始符是否在 cell[0][n] 中。时间 O(n³·|G|)。',
    en: 'The Cocke–Younger–Kasami (CYK) algorithm uses dynamic programming under a Chomsky Normal Form (CNF) grammar to decide derivability. CNF restricts productions to A → BC (two non-terminals) or A → a (one terminal). For input of length n it builds an n×n upper-triangular table: cell[i][j] holds the non-terminals that can derive the substring s[i..i+len-1]. Cells are filled by increasing substring length, each cell enumerating a split point k and merging the left-hand sides of A → BC. Finally it checks whether the start symbol is in cell[0][n]. Time O(n³·|G|).',
  },
  tags: ['parsing', 'dynamic-programming', 'cnf', 'bottom-up'],
  complexity: { time: 'O(n³·|G|)', space: 'O(n²·|G|)' },
};
