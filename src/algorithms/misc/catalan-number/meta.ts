// 卡塔兰数 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'catalan-number',
  categoryId: 'misc',
  title: { zh: '卡塔兰数', en: 'Catalan Number' },
  summary: {
    zh: '递推 C(n)=C(n-1)·2(2n-1)/(n+1) 求第 n 个卡塔兰数。',
    en: 'Compute the n-th Catalan number via the recurrence C(n)=C(n-1)·2(2n-1)/(n+1).',
  },
  description: {
    zh: '卡塔兰数计数：合法括号串、二叉树形态、凸多边形三角剖分、出栈序列等。第 n 项为：\n\n  C(n) = C(2n, n) / (n+1) = (2n)! / ((n+1)!·n!)\n\n递推关系（避免大数阶乘）：\n\n  C(0) = 1\n  C(n) = C(n-1) · 2(2n-1) / (n+1)\n\n前几项：1, 1, 2, 5, 14, 42, 132, 429, ... 时间 O(n)，空间 O(1)。',
    en: 'Catalan numbers count: valid parenthesis strings, binary-tree shapes, polygon triangulations, stack-output sequences. The n-th term is:\n\n  C(n) = C(2n, n) / (n+1) = (2n)! / ((n+1)!·n!)\n\nRecurrence (avoiding huge factorials):\n\n  C(0) = 1\n  C(n) = C(n-1) · 2(2n-1) / (n+1)\n\nFirst terms: 1, 1, 2, 5, 14, 42, 132, 429, ... Time O(n), space O(1).',
  },
  tags: ['combinatorics', 'number-theory'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
