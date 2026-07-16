// SLR(1) Parser · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'slr-parser',
  categoryId: 'parsing',
  title: { zh: 'SLR(1) 分析器', en: 'SLR(1) Parser' },
  summary: {
    zh: 'LR(0) 项目集 + FOLLOW 集消解冲突：自底向上、表驱动。',
    en: 'LR(0) item sets plus FOLLOW sets to resolve conflicts; bottom-up and table-driven.',
  },
  description: {
    zh: 'SLR(1)（Simple LR）分析器是自底向上的移进-归约分析器。它先构造 LR(0) 项目集规范族（状态的闭包与 goto），再用 FOLLOW 集消解归约-移进冲突：当状态 I 含归约项目 A→α· 且下一输入 token ∈ FOLLOW(A) 时才归约。分析过程用状态栈 + 符号栈，查 ACTION/GOTO 表决定移进 (s)、归约 (r)、接受 (acc) 或报错。SLR 比 LR(1) 简单、状态少，但能力较弱（对某些文法会产生本不该归约的冲突），常用于教学与中小规模文法。',
    en: 'The SLR(1) (Simple LR) parser is a bottom-up shift-reduce parser. It first builds the canonical LR(0) item-set family (closure and goto of states), then uses FOLLOW sets to resolve reduce-shift conflicts: a reduction A→α· in state I is applied only when the next input token lies in FOLLOW(A). Parsing drives a state stack plus a symbol stack, consulting an ACTION/GOTO table to shift (s), reduce (r), accept (acc), or error. SLR is simpler and has fewer states than full LR(1) but is less powerful (it can report spurious conflicts for some grammars); it is commonly used for teaching and small grammars.',
  },
  tags: ['parsing', 'bottom-up', 'lr', 'deterministic', 'table-driven'],
  complexity: { time: 'O(n)', space: 'O(|states|·|symbols|)' },
};
