// Parser Combinator · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'parser-combinator',
  categoryId: 'parsing',
  title: { zh: '解析器组合子', en: 'Parser Combinator' },
  summary: {
    zh: '解析器组合子把「小解析器」用高阶函数（seq / choice / many / map）组合成「大解析器」，每个组合子是返回 (结果,新位置) 或失败的纯函数。',
    en: 'Parser combinators build large parsers from small ones via higher-order functions (seq / choice / many / map); each combinator is a pure function returning (result, newPos) or failure.',
  },
  description: {
    zh: '解析器组合子是函数式构建解析器的经典方法：基础解析器有 string（匹配字面量）、regex（匹配正则）、eof；组合子有 seq（顺序）、choice（选择，回溯）、many（零或多次）、map（变换结果）、sepBy（分隔列表）。每个解析器类型为 (input, pos) → { ok, value, pos }。优势：文法即代码、易扩展、可读性强；缺点：带回溯的 choice 最坏指数级。本实现含键值对文法演示（key=value; 重复）。零 DOM 依赖，可独立单测。',
    en: 'Parser combinators are the classic functional approach to building parsers: primitives include string (match literal), regex (match pattern), eof; combinators include seq (sequence), choice (alternation, with backtracking), many (zero-or-more), map (transform result), sepBy (separated list). Each parser has type (input, pos) → { ok, value, pos }. Advantages: grammar-as-code, easily extensible, readable; drawback: backtracking choice is exponential in the worst case. Includes a key=value pair grammar demo (key=value; repeated). Zero DOM dependencies, independently unit-testable.',
  },
  tags: ['parsing', 'functional', 'combinators', 'backtracking'],
  complexity: { time: 'O(n) 线性 / 回溯指数', space: 'O(n)' },
};
