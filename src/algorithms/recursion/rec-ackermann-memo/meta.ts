// 记忆化阿克曼函数 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rec-ackermann-memo',
  categoryId: 'recursion',
  title: { zh: '记忆化阿克曼函数', en: 'Memoized Ackermann Function' },
  summary: {
    zh: '用记忆化缓存递归 Ackermann(m,n)，避免重复子问题计算。',
    en: 'Memoize the recursive Ackermann(m,n) to avoid recomputing overlapping subproblems.',
  },
  description: {
    zh: '阿克曼函数 A(m,n) 是经典的「非原始递归」可计算函数，增长极快：A(4,2) 已是 19728 位十进制数。直接递归会重复计算大量子问题。本实现用 Map 缓存已计算的 (m,n) 对，对相同输入直接返回，显著加速小 m 的计算。定义：A(0,n)=n+1；A(m,0)=A(m-1,1)；A(m,n)=A(m-1,A(m,n-1))。',
    en: 'The Ackermann function A(m,n) is the classic "non-primitive-recursive" computable function that grows extremely fast: A(4,2) already has 19728 decimal digits. Naive recursion recomputes many subproblems. This implementation caches computed (m,n) pairs in a Map for direct lookup, dramatically speeding up small-m cases. Definition: A(0,n)=n+1; A(m,0)=A(m-1,1); A(m,n)=A(m-1,A(m,n-1)).',
  },
  tags: ['recursion', 'ackermann', 'memoization', 'non-primitive-recursive'],
  complexity: { time: 'O(A(m,n))', space: 'O(A(m,n))' },
};
