// 迭代 GCD · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'gcd-iterative-misc',
  categoryId: 'misc',
  title: { zh: '迭代最大公约数（欧几里得）', en: 'Iterative GCD (Euclidean)' },
  summary: {
    zh: '迭代版欧几里得算法：while (b≠0) { (a,b)=(b,a%b) }，最后 a 即 GCD。',
    en: 'Iterative Euclidean: while (b≠0) { (a,b)=(b,a%b) }; the final a is the GCD.',
  },
  description: {
    zh: '最大公约数（Greatest Common Divisor, GCD）是数论基础。欧几里得算法基于性质 GCD(a,b) = GCD(b, a mod b)，反复用较小数替换较大数，直到 b=0，此时 a 即为 GCD。迭代实现：while (b !== 0) { [a, b] = [b, a % b]; } return a。其迭代次数为 O(log min(a,b))（与斐波那契数相关）。相比递归版，迭代版无栈开销、更省内存。GCD 是分数化简、模逆元、中国剩余定理、RSA 密钥生成等的基础构件。对负数输入，通常取绝对值后再算。本实现展示每步替换过程。',
    en: 'The Greatest Common Divisor (GCD) is fundamental to number theory. The Euclidean algorithm rests on the identity GCD(a,b) = GCD(b, a mod b): repeatedly replace the larger by the smaller until b=0, at which point a is the GCD. The iterative form: while (b !== 0) { [a, b] = [b, a % b]; } return a. The number of iterations is O(log min(a,b)) (related to Fibonacci numbers). Compared with the recursive version, the iterative one avoids stack overhead and saves memory. GCD is a building block for fraction reduction, modular inverses, the Chinese Remainder Theorem, and RSA key generation. For negative inputs one usually takes absolute values first. This implementation visualises each substitution step.',
  },
  tags: ['misc', 'number-theory', 'euclidean', 'iterative'],
  complexity: { time: 'O(log min(a,b))', space: 'O(1)' },
};
