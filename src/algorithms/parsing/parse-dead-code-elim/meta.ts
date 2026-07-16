// 死代码消除 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'parse-dead-code-elim',
  categoryId: 'parsing',
  title: { zh: '死代码消除', en: 'Dead Code Elimination' },
  summary: {
    zh: '删除对程序结果无影响的语句：不可达代码与未使用定义。',
    en: 'Remove statements that cannot affect program output: unreachable code and unused definitions.',
  },
  description: {
    zh: '死代码消除（DCE）删除两类代码：(1) 不可达代码 —— 在 return/break/continue 之后绝不会被执行的语句；(2) 未使用定义 —— 其结果从未被读取的赋值。本实现作用于一个简单语句列表 IR：每条语句是赋值（Assign）、返回（Return）或表达式（Expr）。先做一遍「可达性标记」（遇到 Return 后标记其后为不可达），再做「活跃变量分析」删除对死变量的赋值。删除不可达与死赋值后输出精简的 IR。',
    en: 'Dead Code Elimination (DCE) removes two kinds of code: (1) unreachable code — statements after return/break/continue that can never execute; (2) unused definitions — assignments whose result is never read. This implementation operates on a simple statement-list IR where each statement is Assign, Return, or Expr. It first marks reachability (statements after a Return become unreachable), then runs a liveness analysis to drop assignments to dead variables. The output is a trimmed IR.',
  },
  tags: ['parsing', 'optimization', 'compiler', 'dead-code'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
