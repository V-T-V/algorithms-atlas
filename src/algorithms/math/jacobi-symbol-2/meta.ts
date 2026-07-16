// 雅可比符号（递归互反律版）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'jacobi-symbol-2',
  categoryId: 'math',
  title: { zh: '雅可比符号（递归互反律版）', en: 'Jacobi Symbol (Recursive Reciprocity)' },
  summary: {
    zh: '用二次互反律递归化简 J(a,n)，BigInt 实现，对合数模数亦成立。',
    en: 'Recursively reduce J(a,n) via quadratic reciprocity; BigInt-based; valid for composite odd moduli.',
  },
  description: {
    zh: '雅可比符号 J(a,n)（n 为奇正整数）是 Legendre 符号的推广（对合数模数亦定义）。取值 {-1,0,1}。本实现用二次互反律递归化简：(1) 提出因子 2，J(2,n)=(-1)^((n²-1)/8)；(2) 互反律 J(a,n)=(-1)^((a-1)(n-1)/4)·J(n mod a, a)（a,n 均奇）。类似欧几里得的 O(log n) 递归。BigInt 实现，与基于 number 的另一版本互为对照。',
    en: 'The Jacobi symbol J(a,n) for odd positive n generalizes the Legendre symbol (defined for composite moduli too), taking values {-1,0,1}. This implementation reduces recursively via quadratic reciprocity: (1) factor out 2s, J(2,n)=(-1)^((n²-1)/8); (2) reciprocity J(a,n)=(-1)^((a-1)(n-1)/4)·J(n mod a, a) for odd a,n. An O(log n) recursion akin to Euclid. BigInt-based, complementing the number-based version.',
  },
  tags: ['math', 'number-theory', 'jacobi', 'quadratic-residue', 'recursion'],
  complexity: { time: 'O(log n)', space: 'O(log n)' },
};
