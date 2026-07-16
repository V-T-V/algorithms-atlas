// 递归数组求积 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rec-accumulate-product',
  categoryId: 'recursion',
  title: { zh: '递归数组求积', en: 'Recursive Array Product' },
  summary: {
    zh: '用递归求所有元素连乘积：prod(a) = a[0] * prod(a[1..])。',
    en: 'Compute the product of all elements recursively: prod(a) = a[0] * prod(a[1..]).',
  },
  description: {
    zh: '将首元素与剩余部分递归求积相乘。基础情形空数组返回 1（乘法单位元）。常用于演示递归结构 + 数学结合律。O(n)。',
    en: 'Multiply the first element by the recursive product of the rest; the empty-array base case returns 1 (the multiplicative identity). Often used to illustrate recursion with associativity. O(n).',
  },
  tags: ['recursion', 'product', 'array'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
