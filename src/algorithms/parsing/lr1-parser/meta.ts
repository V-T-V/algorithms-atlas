// LR(1) Parser · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'lr1-parser',
  categoryId: 'parsing',
  title: { zh: 'LR(1) 分析器', en: 'LR(1) Parser' },
  summary: {
    zh: '规范 LR：LR(0) 项目附加 1-token 向前看，构造最强移进-归约表。',
    en: 'Canonical LR: LR(0) items augmented with one-token lookahead, producing the most powerful shift-reduce table.',
  },
  description: {
    zh: 'LR(1)（Canonical LR）分析器是最强的确定性 LR 分析器（Knuth 1965）。每个 LR(1) 项目形如 [A→α·β, a]，即在 LR(0) 项目上附加一个向前看符号 a。构造项目集时，闭包会把 a 经 FIRST(βa) 传播给子项目。归约时只在 ACTION[state, a] 处归约（而非 SLR 的整个 FOLLOW 集），从而消解 SLR 无法处理的冲突。代价是状态数可能爆炸（最坏指数级）。LR(1) 能识别几乎所有程序设计语言文法，是 YACC/Bison 的默认模式（实际用 LALR 合并）。',
    en: 'The LR(1) (Canonical LR) parser is the most powerful deterministic LR parser (Knuth 1965). Each LR(1) item has the form [A→α·β, a], attaching one lookahead token a to an LR(0) item. During item-set construction, closure propagates FIRST(βa) as new lookaheads. Reductions are placed only in ACTION[state, a] (rather than the whole FOLLOW set as in SLR), resolving conflicts SLR cannot handle. The cost is potential state explosion (worst-case exponential). LR(1) recognizes virtually all programming-language grammars and underlies YACC/Bison (which in practice merge states via LALR).',
  },
  tags: ['parsing', 'bottom-up', 'lr', 'deterministic', 'table-driven'],
  complexity: { time: 'O(n)', space: 'O(|states|·|symbols|)' },
};
