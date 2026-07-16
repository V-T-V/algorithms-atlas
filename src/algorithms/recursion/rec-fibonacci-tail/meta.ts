// 尾递归斐波那契 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rec-fibonacci-tail',
  categoryId: 'recursion',
  title: { zh: '尾递归斐波那契', en: 'Tail-Recursive Fibonacci' },
  summary: {
    zh: '用双累加器把斐波那契写成尾递归 fib(n,a,b)，O(n) 时间、O(1) 栈空间。',
    en: 'Rewrite Fibonacci as a tail recursion fib(n,a,b) with two accumulators: O(n) time, O(1) stack under TCO.',
  },
  description: {
    zh: '朴素递归 fib(n)=fib(n-1)+fib(n-2) 时间复杂度 O(2^n) 且非尾递归。引入两个累加器 a、b（分别表示 fib(i) 和 fib(i+1)），改写为 fib(n, a, b)：若 n=0 返回 a；否则 fib(n-1, b, a+b)。递归调用是最后操作，可被 TCO 优化为循环。本实现返回 bigint 支持大数，并与朴素递归对照。',
    en: 'The naive recursion fib(n)=fib(n-1)+fib(n-2) runs in O(2^n) and is not tail-recursive. Introducing two accumulators a, b (representing fib(i) and fib(i+1)) yields fib(n,a,b): if n=0 return a; else fib(n-1, b, a+b). The recursive call is the last operation, so TCO turns it into a loop. This implementation returns bigint for large values and is compared against the naive recursion.',
  },
  tags: ['recursion', 'fibonacci', 'tail-recursion', 'accumulator'],
  complexity: { time: 'O(n)', space: 'O(n) → O(1) with TCO' },
};
