// 快速幂（尾递归）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rec-pow-tail-2',
  categoryId: 'recursion',
  title: { zh: '快速幂（尾递归）', en: 'Fast Exponentiation (Tail-Recursive)' },
  summary: {
    zh: '二进制拆分指数 + 累加器，使每次递归是尾调用，O(log n)。',
    en: 'Binary decomposition of the exponent with an accumulator, each recursive call being a tail call. O(log n).',
  },
  description: {
    zh: 'fastPow(base, exp, acc=1)：exp 为偶数则 base 平方、exp 折半；奇数则 acc *= base 并 exp--。所有分支都以递归调用结束（尾位置），acc 累积结果。比朴素递归 O(n) 快得多。',
    en: 'fastPow(base, exp, acc=1): if exp is even, square base and halve exp; if odd, multiply acc by base and decrement exp. All branches end in a tail call; acc accumulates the result. Much faster than naive O(n) recursion.',
  },
  tags: ['recursion', 'exponentiation', 'tail-call', 'binary'],
  complexity: { time: 'O(log n)', space: 'O(log n)' },
};
