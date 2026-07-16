// LL(1) Parser · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'll1-parser',
  categoryId: 'parsing',
  title: { zh: 'LL(1) 预测分析', en: 'LL(1) Predictive Parser' },
  summary: {
    zh: '自顶向下、表驱动：用栈 + 当前输入 token 查预测表选产生式。',
    en: 'Top-down, table-driven: use a stack plus the current input token to pick productions from a predictive table.',
  },
  description: {
    zh: 'LL(1) 解析器是自顶向下的预测分析器：从文法起始符出发，用「栈」记录待匹配符号，用「当前输入 token」查 LL(1) 预测分析表，选出唯一应使用的产生式（无回溯）。LL 表示从左推导、最左扫描，(1) 表示向前看 1 个 token。需要文法满足：每条产生式的 FIRST 集互不相交，且与 FOLLOW 集无冲突。本实现硬编码简单文法 S → aSb | ε 用于演示栈驱动的接受/拒绝过程。',
    en: 'An LL(1) parser is a top-down predictive parser: starting from the start symbol, it uses a stack of symbols to match and the current input token to look up a predictive parse table, choosing exactly one production (no backtracking). LL means Leftmost derivation, Left-to-right scan; (1) means one token of lookahead. The grammar must have disjoint FIRST sets and no FIRST/FOLLOW conflicts. This implementation hard-codes the simple grammar S → aSb | ε to demonstrate the stack-driven accept/reject process.',
  },
  tags: ['parsing', 'top-down', 'deterministic', 'stack'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
