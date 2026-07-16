// 常量折叠 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'parse-constant-folding',
  categoryId: 'parsing',
  title: { zh: '常量折叠', en: 'Constant Folding' },
  summary: {
    zh: '编译期对全由常量组成的子表达式求值，替换为字面量节点。',
    en: 'Evaluate sub-expressions made entirely of constants at compile time and replace them with literal nodes.',
  },
  description: {
    zh: '常量折叠是编译器最早的优化之一：若一个表达式的所有操作数都是编译期已知的常量，则可在编译期直接算出结果，避免运行时计算。本实现对算术（+ - * /）、比较（< > == !=）、逻辑（and or not）和一元负号做折叠。采用不动点迭代：每轮自底向上折叠，直到没有变化。能合并嵌套常量表达式，如 (1+2)*(3+4) → 21。它通常与常量传播（constant propagation）配合使用。',
    en: 'Constant folding is one of the earliest compiler optimizations: if every operand of an expression is a compile-time constant, the result can be computed at compile time, avoiding runtime work. This implementation folds arithmetic (+ - * /), comparison (< > == !=), logic (and or not), and unary negation, using fixpoint iteration (bottom-up per round until no change). It collapses nested constant expressions like (1+2)*(3+4) → 21. Usually paired with constant propagation.',
  },
  tags: ['parsing', 'optimization', 'compiler', 'constant-folding'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
