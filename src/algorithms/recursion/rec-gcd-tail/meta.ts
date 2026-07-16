// 尾递归最大公约数 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rec-gcd-tail',
  categoryId: 'recursion',
  title: { zh: '尾递归欧几里得 GCD', en: 'Tail-Recursive Euclidean GCD' },
  summary: {
    zh: '欧几里得算法 gcd(a,b)=gcd(b,a mod b) 本身就是尾递归，天然可被 TCO 优化。',
    en: 'The Euclidean algorithm gcd(a,b)=gcd(b,a mod b) is inherently tail-recursive and naturally benefits from TCO.',
  },
  description: {
    zh: '欧几里得算法求最大公约数：gcd(a,0)=a；gcd(a,b)=gcd(b, a mod b)。每一步递归调用 gcd(b, a mod b) 都是函数体的最后操作，是严格的尾递归。它的时间复杂度为 O(log min(a,b))（与斐波那契数列相关：最坏情况输入是相邻斐波那契数）。本实现同时提供减法版（更相减损术）对照。',
    en: 'The Euclidean algorithm for the greatest common divisor: gcd(a,0)=a; gcd(a,b)=gcd(b, a mod b). Each recursive call gcd(b, a mod b) is the last operation of the body: a strict tail recursion. Its time complexity is O(log min(a,b)) (worst-case inputs are consecutive Fibonacci numbers). This implementation also provides the subtraction variant for comparison.',
  },
  tags: ['recursion', 'gcd', 'euclidean', 'tail-recursion'],
  complexity: { time: 'O(log min(a,b))', space: 'O(log min(a,b)) → O(1) with TCO' },
};
