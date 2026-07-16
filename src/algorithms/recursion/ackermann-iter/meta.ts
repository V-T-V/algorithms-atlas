// 迭代版 Ackermann（栈模拟）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ackermann-iter',
  categoryId: 'recursion',
  title: { zh: '迭代 Ackermann（栈模拟）', en: 'Iterative Ackermann (Stack-Simulated)' },
  summary: {
    zh: '用显式栈模拟 Ackermann 递归，避免爆调用栈。',
    en: 'Use an explicit stack to simulate Ackermann recursion, avoiding call-stack overflow.',
  },
  description: {
    zh: 'Ackermann 函数 A(m,n) 是著名的「非原始递归」函数，增长极快：\n- A(0,n) = n+1\n- A(m,0) = A(m−1,1)\n- A(m,n) = A(m−1, A(m,n−1))\n\n直接递归会因深度极大（如 A(3,4) 就需要成千上万层）而爆调用栈。迭代版用一个显式栈：栈顶元素表示「待求的 (m,n) 对」，反复应用规则直到栈空，结果即栈顶派生值。\n\n时间随结果指数级增长，空间 O(A(m,n))。',
    en: 'Ackermann A(m,n) grows explosively: A(0,n)=n+1; A(m,0)=A(m-1,1); A(m,n)=A(m-1,A(m,n-1)). Direct recursion overflows the call stack. This iterative version uses an explicit stack of pending (m,n) pairs, applying rules until the stack yields a single value. Time grows exponentially with the result; space O(A(m,n)).',
  },
  tags: ['recursion', 'ackermann', 'stack', 'non-primitive-recursive'],
  complexity: { time: 'O(A(m,n))', space: 'O(A(m,n))' },
};
