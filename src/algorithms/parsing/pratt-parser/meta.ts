// Pratt Parser · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'pratt-parser',
  categoryId: 'parsing',
  title: { zh: 'Pratt 优先级爬升', en: 'Pratt Parser (Precedence Climbing)' },
  summary: {
    zh: '用左/右结合力表驱动表达式解析，简洁处理优先级与结合性。',
    en: 'Driven by left/right binding-power tables, it handles precedence and associativity concisely.',
  },
  description: {
    zh: 'Pratt 解析器（ Vaughan Pratt, 1973）用「结合力」（binding power）表把运算符优先级与结合性编码为两个数字（左结合力、右结合力），递归地按结合力爬升解析表达式。相比手写递归下降的层层函数，它用一张表统一处理一元/二元/括号，且极易扩展新运算符。本实现支持 + - * / 与右结合的 ^（幂），用 null 表示解析终止，返回求值结果。',
    en: 'The Pratt parser (Vaughan Pratt, 1973) encodes operator precedence and associativity as two numbers (left and right binding power) in a table, recursively climbing by binding power. Compared to layered recursive-descent functions, it handles unary/binary/paren operators via a single table and extends easily. This implementation supports + - * / and right-associative ^ (power), using null as a parse terminator and returning the evaluated result.',
  },
  tags: ['parsing', 'expression', 'precedence', 'recursive'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
