// 尾递归阶乘 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rec-factorial-tail',
  categoryId: 'recursion',
  title: { zh: '尾递归阶乘', en: 'Tail-Recursive Factorial' },
  summary: {
    zh: '用累加器把阶乘写成尾递归形式 fact(n, acc)，可被尾调用优化。',
    en: 'Rewrite factorial as a tail recursion fact(n, acc) using an accumulator, enabling tail-call optimization.',
  },
  description: {
    zh: '阶乘 fact(n)=n! 的朴素递归 fact(n)=n·fact(n-1) 不是尾递归（乘法在递归返回后）。通过引入累加器 acc，改写为 fact(n, acc)=fact(n-1, n·acc)，递归调用成为函数体最后一步操作，是严格的尾调用。支持尾调用优化（TCO）的语言（如 Scheme）可将其编译为等价的循环，常量栈空间，避免栈溢出。本实现同时提供朴素递归版本以作对照。',
    en: 'The naive recursive factorial fact(n)=n·fact(n-1) is not tail-recursive (the multiplication happens after the call returns). Introducing an accumulator rewrites it as fact(n,acc)=fact(n-1, n·acc), where the recursive call is the very last operation: a strict tail call. Languages with tail-call optimization (TCO), like Scheme, compile this into an equivalent loop with constant stack space, avoiding stack overflow. This implementation also provides the naive recursive version for comparison.',
  },
  tags: ['recursion', 'factorial', 'tail-recursion', 'accumulator'],
  complexity: { time: 'O(n)', space: 'O(n) → O(1) with TCO' },
};
