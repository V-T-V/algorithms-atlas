// 类型检查器 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'parse-type-check',
  categoryId: 'parsing',
  title: { zh: '类型检查器', en: 'Type Checker' },
  summary: {
    zh: '自底向上为表达式 AST 推导类型，并报告不兼容运算。',
    en: 'Bottom-up infer types for an expression AST and report incompatible operations.',
  },
  description: {
    zh: '类型检查器对 AST 做后序遍历：先推出每个子表达式的类型，再根据运算符的签名推出本节点类型，并验证子节点类型相容。本实现处理一个极简类型系统：基础类型 int、float、bool、string，二元算术 + - * / 要求两侧同为数值（int/float，结果取较宽的），比较 == != < > 返回 bool，逻辑 and or 要求两侧 bool。对不兼容的运算记录类型错误。这正是静态类型语言编译器的核心一环。',
    en: 'A type checker post-order traverses the AST: infer each sub-expression type, then derive this node type from the operator signature and verify children are compatible. This implementation handles a tiny type system: base types int, float, bool, string; arithmetic + - * / require both sides numeric (int/float, result is the wider); comparisons == != < > return bool; logical and or require both bool. Incompatible operations record a type error. This is the core of statically-typed language compilers.',
  },
  tags: ['parsing', 'type-system', 'compiler', 'ast'],
  complexity: { time: 'O(n)', space: 'O(d)' },
};
