// 有理逼近（Stern-Brocot 二分）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rational-approximation',
  categoryId: 'math',
  title: { zh: '有理逼近（Stern-Brocot 二分）', en: 'Rational Approximation (Stern-Brocot)' },
  summary: {
    zh: '用 Stern-Brocot 树二分在分母 ≤ N 约束下找最佳逼近 p/q。',
    en: 'Find the best rational p/q with denominator ≤ N via Stern-Brocot tree bisection.',
  },
  description: {
    zh: '有理逼近：给定实数 x 与分母上界 N，求分母 ≤ N 的最佳有理近似 p/q。本实现用 Stern-Brocot 树的二分搜索：维护区间 [lo/1, hi/1]，反复取中位 mediants (a+c)/(b+d)，比较与 x 的大小决定向左或向右走，当 mediant 分母超过 N 时停止，返回当前区间端点中较优者。区别于已有的 rational-approx（连分数收敛子法），本算法用 Stern-Brocot 树，能精确控制在分母上界内的最优。',
    en: 'Rational approximation: given a real x and a denominator bound N, find the best rational p/q with q ≤ N. This implementation uses Stern-Brocot tree bisection: maintain interval [lo/1, hi/1], repeatedly take the mediant (a+c)/(b+d), compare to x to decide left or right, and stop when the mediant denominator exceeds N, returning the better of the current endpoints. Distinct from the existing rational-approx (continued-fraction convergent method), this uses the Stern-Brocot tree for precise control of the denominator-bound optimum.',
  },
  tags: ['math', 'number-theory', 'rational', 'stern-brocot', 'approximation'],
  complexity: { time: 'O(N)', space: 'O(1)' },
};
