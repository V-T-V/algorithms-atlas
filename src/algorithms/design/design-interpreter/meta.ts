// 解释器模式（Interpreter）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'design-interpreter',
  categoryId: 'design',
  title: { zh: '解释器模式', en: 'Interpreter' },
  summary: { zh: '用语法树解释语言表达式。', en: 'Evaluate expressions via a syntax tree.' },
  description: {
    zh: '解释器模式为每种语法规则定义一个表达式类，递归求值语法树，常用于查询语言、规则引擎。',
    en: 'The Interpreter pattern defines an expression class per grammar rule and recursively evaluates the AST; used in query languages and rule engines.',
  },
  tags: ['design', 'pattern', 'interpreter', 'behavioral'],
  complexity: { time: 'O(n)', space: 'O(h)' },
};
