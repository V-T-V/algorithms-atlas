// FizzBuzz · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'fizzbuzz-impl',
  categoryId: 'misc',
  title: { zh: 'FizzBuzz', en: 'FizzBuzz' },
  summary: {
    zh: '遍历 1..n：被 3 整除输出 Fizz，被 5 整除输出 Buzz，都被整除输出 FizzBuzz。',
    en: 'Iterate 1..n: divisible by 3 prints Fizz, by 5 prints Buzz, by both prints FizzBuzz.',
  },
  description: {
    zh: 'FizzBuzz 是一道经典的编程入门题，常用于考察基本控制流。规则：从 1 数到 n，对每个数 i：若 i 同时被 3 和 5 整除，输出 "FizzBuzz"；若只被 3 整除，输出 "Fizz"；若只被 5 整除，输出 "Buzz"；否则输出 i 本身。能同时被 3 和 5 整除即被 15 整除。关键在于判断顺序与取模运算（i % 3 === 0）。本实现附带事件钩子，可逐步演示每个数的判定过程，适合可视化教学。它虽简单，却是最小化的「分类与输出」算法范式。',
    en: 'FizzBuzz is a classic beginner programming exercise used to test basic control flow. Rule: count from 1 to n; for each i: if i is divisible by both 3 and 5 print "FizzBuzz"; if only by 3 print "Fizz"; if only by 5 print "Buzz"; otherwise print i itself. "Divisible by both 3 and 5" is equivalent to divisible by 15. The key points are the order of checks and the modulo operation (i % 3 === 0). This implementation provides event hooks so each number\'s classification can be visualised step by step. Though trivial, it is the minimal "classify and output" algorithm pattern.',
  },
  tags: ['misc', 'control-flow', 'modulo'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
