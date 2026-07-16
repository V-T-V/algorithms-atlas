// 杨辉三角 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'pascals-triangle',
  categoryId: 'misc',
  title: { zh: '杨辉三角', en: "Pascal's Triangle" },
  summary: {
    zh: '逐行用上一行相邻两数之和生成二项式系数表。',
    en: 'Build the binomial-coefficient table row by row from sums of adjacent entries.',
  },
  description: {
    zh: "杨辉三角（Pascal's triangle）：第 n 行（0-based）给出二项式系数 C(n,0..n)。每行首尾为 1，中间元素 = 上一行相邻两元素之和。\n\n- 第 0 行：[1]\n- 第 n 行：[1, 上一行(0)+上一行(1), ..., 1]\n\n性质：每行之和为 2ⁿ；对称；第 n 行第 k 个 = C(n,k)。时间 O(n²)。",
    en: "Pascal's triangle: row n (0-based) gives the binomial coefficients C(n,0..n). Each row starts and ends with 1; inner entries are the sum of the two above.\n\n- Row 0: [1]\n- Row n: [1, prev(0)+prev(1), ..., 1]\n\nProperties: each row sums to 2ⁿ; symmetric; entry (n,k) = C(n,k). Time O(n²).",
  },
  tags: ['combinatorics', 'dynamic-programming'],
  complexity: { time: 'O(n²)', space: 'O(n²)' },
};
