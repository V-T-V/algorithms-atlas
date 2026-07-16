// 扩展欧几里得 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'extended-euclidean-misc-impl',
  categoryId: 'misc',
  title: { zh: '扩展欧几里得', en: 'Extended Euclidean Algorithm' },
  summary: {
    zh: '求 GCD(a,b) 的同时返回 Bézout 系数 x,y 使 a·x + b·y = GCD(a,b)。',
    en: 'Compute GCD(a,b) alongside Bézout coefficients x,y with a·x + b·y = GCD(a,b).',
  },
  description: {
    zh: '扩展欧几里得算法（Extended Euclidean Algorithm）在求最大公约数的同时，求出 Bézout 恒等式的系数：对任意整数 a、b，存在整数 x、y 使得 a·x + b·y = GCD(a,b)。迭代实现维护两组系数（x1,y1）和（x2,y2），随欧几里得的每步 (a,b)=(b,a%b) 同步更新，最终 x、y 即为所求系数。它是模逆元（a·x ≡ 1 mod m 当 GCD(a,m)=1）、求解线性丢番图方程 a·x + b·y = c（当 c 是 GCD 的倍数时有解）、以及中国剩余定理合并同余式的核心工具。例如 GCD(240,46)=2，且 240·(-9)+46·47=2。本实现展示系数随迭代回代的过程。',
    en: 'The Extended Euclidean Algorithm computes the greatest common divisor while also finding the Bézout identity coefficients: for any integers a, b there exist integers x, y with a·x + b·y = GCD(a,b). The iterative version maintains two coefficient pairs (x1,y1) and (x2,y2), updating them in lockstep with each Euclidean step (a,b)=(b,a%b); the final x, y are the Bézout coefficients. It is the key tool for modular inverses (a·x ≡ 1 mod m when GCD(a,m)=1), solving linear Diophantine equations a·x + b·y = c (solvable when c is a multiple of the GCD), and merging congruences in the Chinese Remainder Theorem. For example, GCD(240,46)=2 and 240·(-9)+46·47=2. This implementation visualises the coefficient back-substitution.',
  },
  tags: ['misc', 'number-theory', 'euclidean', 'bezout'],
  complexity: { time: 'O(log min(a,b))', space: 'O(1)' },
};
