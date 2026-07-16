// Factorial · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'factorial',
  categoryId: 'recursion',
  title: { zh: '阶乘', en: 'Factorial' },
  summary: {
    zh: '递归入门经典：n! = n × (n-1)!，基线 0! = 1，演示调用栈与回归。',
    en: 'A recursion classic: n! = n × (n-1)! with base case 0! = 1; illustrates the call stack and unwinding.',
  },
  description: {
    zh: '阶乘是学习递归最常见的入门示例。其递归定义简洁明了：\n\n  - 基线情形：0! = 1\n  - 递归情形：n! = n × (n-1)!（n ≥ 1）\n\n每一次调用 factorial(n) 都会触发一次 factorial(n-1)，直到 n 归零命中基线；随后栈帧逐层「弹栈」，把乘积自底向上累加。这一「递推下去、回归回来」的双阶段过程正是分治与递归的核心结构。\n\n本实现通过 onRecurse / onReturn 钩子清晰呈现调用栈的「先加深后回退」轨迹。空间复杂度为 O(n)（最大栈深 = n+1）。注意：结果在 n 较大时会迅速溢出 JS 安全整数（Number.MAX_SAFE_INTEGER = 2^53-1，约对应 18!）。',
    en: 'Factorial is the most common introductory example for recursion. Its recursive definition is crisp:\n\n  - Base case: 0! = 1\n  - Recursive case: n! = n × (n-1)! (n ≥ 1)\n\nEach call to factorial(n) triggers factorial(n-1), bottoming out at 0; then stack frames unwind, accumulating the product bottom-up. This two-phase "recurse down, return up" structure is the heart of divide-and-conquer and recursion in general.\n\nThis implementation exposes the call-stack trajectory via onRecurse / onReturn hooks. Space complexity is O(n) (max stack depth = n+1). Note: the result overflows JS safe integers (Number.MAX_SAFE_INTEGER = 2^53-1, roughly 18!) for moderately large n.',
  },
  tags: ['recursion', 'math', 'classic'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
