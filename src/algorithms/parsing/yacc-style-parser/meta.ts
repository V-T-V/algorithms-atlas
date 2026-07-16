// Yacc-style Parser · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'yacc-style-parser',
  categoryId: 'parsing',
  title: { zh: 'Yacc 风格解析器（动作表驱动）', en: 'Yacc-style Parser (Action-Table Driven)' },
  summary: {
    zh: 'Yacc 风格解析器由 LALR(1) 动作表（ACTION/GOTO）驱动移进-归约，并在每条归约规则上挂载语义动作（$$ = $1 op $2）计算属性值。',
    en: 'A Yacc-style parser is driven by an LALR(1) action table (ACTION/GOTO) performing shift-reduce, with a semantic action attached to each reduction rule ($$ = $1 op $2) to compute attribute values.',
  },
  description: {
    zh: '本算法模拟 yacc/bison 的运行时：(1) 显式给定 ACTION 表（按 [状态, 终结符] 查 shift/reduce/accept/error）与 GOTO 表（按 [状态, 非终结符] 查转移）；(2) 解析器维护状态栈与值栈，读 token 查 ACTION 决定移进（压状态+值）或归约（弹 |β| 层、执行语义动作计算 $$、按 GOTO 压入）；(3) 语义动作把归约出的非终结符关联一个计算值（如表达式求值）。文法为经典算术表达式，含优先级。零 DOM 依赖，可独立单测。',
    en: 'This algorithm emulates the yacc/bison runtime: (1) an explicit ACTION table (indexed by [state, terminal] → shift/reduce/accept/error) and GOTO table (indexed by [state, nonterminal]); (2) the parser maintains a state stack and a value stack, consulting ACTION per token to shift (push state+value) or reduce (pop |β| levels, run the semantic action to compute $$, push per GOTO); (3) semantic actions bind each reduced nonterminal to a computed value (e.g. expression evaluation). The grammar is the classic arithmetic expression with precedence. Zero DOM dependencies, independently unit-testable.',
  },
  tags: ['parsing', 'lr', 'shift-reduce', 'semantic-actions'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
