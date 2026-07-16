// McCarthy 91 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'mccarthy-91',
  categoryId: 'recursion',
  title: { zh: 'McCarthy 91 函数', en: 'McCarthy 91 Function' },
  summary: {
    zh: '反直觉的递归函数：M(n)=M(M(n+11))（n≤100），对任意 n≤100 恒返回 91。',
    en: 'A counterintuitive recursive function: M(n)=M(M(n+11)) for n≤100 always returns 91 for any n≤100.',
  },
  description: {
    zh: 'McCarthy 91 函数由人工智能先驱 John McCarthy 设计，是递归论中一个著名「反直觉」函数：\n\n  - M(n) = n - 10,           当 n > 100\n  - M(n) = M(M(n + 11)),      当 n ≤ 100\n\n它的神奇之处在于：对于任意 n ≤ 100，M(n) 都恰好等于 91；只有当 n > 100 时 M(n) = n - 10 才「正常」。换句话说，区间 (-∞, 100] 被这个递归「吸引」到不动点 91。\n\n直观理解：n ≤ 100 时反复执行「+11」，每当超过 100 就做一次「-10」并回弹，最终一定收束到 91。可以证明 M(M(91)) = M(91) = 91，故 91 是该函数的不动点。\n\n本实现提供朴素递归版（演示调用链）与闭式版（n>100 时 n-10，否则 91，用于验证）。演示默认输入 n=80，观察它如何「爬升-回弹」最终落到 91。',
    en: 'The McCarthy 91 function, designed by AI pioneer John McCarthy, is a famous "counterintuitive" function in recursion theory:\n\n  - M(n) = n - 10,           for n > 100\n  - M(n) = M(M(n + 11)),      for n ≤ 100\n\nIts magic: for any n ≤ 100, M(n) is always exactly 91; only for n > 100 does M(n) = n - 10 behave "normally". In other words, the interval (-∞, 100] is "attracted" by this recursion to the fixed point 91.\n\nIntuition: for n ≤ 100 we repeatedly "+11"; each time we exceed 100 we do a "-10" and bounce back, eventually converging to 91. One can prove M(M(91)) = M(91) = 91, so 91 is a fixed point.\n\nThis implementation provides a naive recursive version (to show the call chain) and a closed-form version (n-10 if n>100, else 91, for verification). The demo uses n=80 to watch it "climb and bounce" down to 91.',
  },
  tags: ['recursion', 'fixed-point', 'classic'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
