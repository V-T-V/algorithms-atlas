// Ackermann · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ackermann',
  categoryId: 'recursion',
  title: { zh: '阿克曼函数', en: 'Ackermann Function' },
  summary: {
    zh: '经典双递归函数：A(m,n)=A(m-1, A(m,n-1))，可计算但非原始递归，增长极快。',
    en: 'A classic nested-recursion function: A(m,n)=A(m-1, A(m,n-1)); computable yet not primitive-recursive, grows astronomically.',
  },
  description: {
    zh: '阿克曼函数（Ackermann function）由 Wilhelm Ackermann 于 1928 年提出，是递归论中「可计算但非原始递归」函数的最著名例子。\n\n其递归定义（Péter 版本）：\n  - A(0, n) = n + 1\n  - A(m, 0) = A(m-1, 1)（m > 0）\n  - A(m, n) = A(m-1, A(m, n-1))（m, n > 0）\n\n第三条是「嵌套递归」：内层 A(m, n-1) 的返回值作为外层 A(m-1, ·) 的参数。这种结构使其无法用原始递归（for 循环）表达，但仍是可计算的。\n\n增长速度惊人：A(3,n)≈2^(n+3)−3，A(4,n) 是高德纳箭号记号 2↑↑(n+3)−3（迭代幂次），A(4,2)=2^65536−3 是 19729 位数。A(4,3) 已无法在合理时间内求值。本实现用朴素递归演示其结构；演示默认输入限制在 m≤2 以避免指数爆炸。',
    en: 'The Ackermann function, introduced by Wilhelm Ackermann in 1928, is the most famous example of a computable yet non-primitive-recursive function in recursion theory.\n\nRecursive definition (Péter version):\n  - A(0, n) = n + 1\n  - A(m, 0) = A(m-1, 1) (m > 0)\n  - A(m, n) = A(m-1, A(m, n-1)) (m, n > 0)\n\nThe third rule is "nested recursion": the inner A(m, n-1) returns the argument to the outer A(m-1, ·). This structure cannot be expressed with primitive recursion (for-loops) yet remains computable.\n\nGrowth is staggering: A(3,n)≈2^(n+3)−3; A(4,n) equals Knuth\'s up-arrow 2↑↑(n+3)−3 (tetration); A(4,2)=2^65536−3 is a 19729-digit number. A(4,3) is practically uncomputable. This implementation uses naive recursion to expose the structure; the demo restricts m≤2 to avoid blow-up.',
  },
  tags: ['recursion', 'math', 'nested-recursion', 'classic'],
  complexity: { time: 'O(A(m,n))', space: 'O(m+n)' },
};
