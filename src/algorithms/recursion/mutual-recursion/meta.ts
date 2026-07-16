// 互递归判奇偶（isEven/isOdd）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'mutual-recursion',
  categoryId: 'recursion',
  title: { zh: '互递归判奇偶', en: 'Mutual Recursion (Even/Odd)' },
  summary: {
    zh: 'isEven 调用 isOdd，isOdd 调用 isEven，两函数互相递归。',
    en: 'isEven calls isOdd and vice versa; two functions recurse into each other.',
  },
  description: {
    zh: '互递归（mutual recursion）是两个或多个函数互相调用构成递归。经典教学例子是判奇偶：\n- isEven(0) = true（基线）\n- isOdd(0) = false（基线）\n- isEven(n) = isOdd(n−1)\n- isOdd(n) = isEven(n−1)\n\n两者交替调用，每层 n 减 1，最终命中基线。本实现演示互递归结构与调用栈交替展开。\n\n时间 O(n)，空间 O(n)（调用栈深度 n）。',
    en: 'Mutual recursion: functions call each other to form a recursion. Canonical example: isEven(n)=isOdd(n-1), isOdd(n)=isEven(n-1), with base cases isEven(0)=true, isOdd(0)=false. They alternate, decrementing n each layer. O(n) time and stack.',
  },
  tags: ['recursion', 'mutual-recursion', 'even-odd', 'teaching'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
