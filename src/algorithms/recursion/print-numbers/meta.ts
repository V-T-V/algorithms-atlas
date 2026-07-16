// 递归打印 1 到 n · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'print-numbers',
  categoryId: 'recursion',
  title: { zh: '递归打印 1 到 n', en: 'Recursively Print 1 to n' },
  summary: {
    zh: '先递归到 1 再回溯打印，或先打印再递归，演示递归顺序。',
    en: 'Recurse down to 1 then print on the way back, or print then recurse; demonstrates recursion order.',
  },
  description: {
    zh: '递归打印 1 到 n（升序）有两种方式：\n\n方式 A（先递归后打印，回溯时升序）：\n- print(n−1) 先递归\n- 再输出 n\n\n方式 B（先打印后递归）：\n- 输出 n−（递归层数）… 需要传参\n\n本实现采用方式 A：基线 n < 1 不输出，否则先 print(n−1) 再收集 n。结果序列为 [1, 2, …, n]。\n\n时间 O(n)，空间 O(n)。',
    en: 'Two ways to print 1..n recursively. This version uses "recurse first, then collect" (post-order): base n<1 stops; otherwise print(n-1) then emit n. Produces [1,2,...,n]. O(n) time and space.',
  },
  tags: ['recursion', 'print', 'teaching', 'sequence'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
