// LALR 状态合并 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'parse-lalr-merge',
  categoryId: 'parsing',
  title: { zh: 'LALR 状态合并', en: 'LALR State Merging' },
  summary: {
    zh: '把 LR(1) 项目集中「同心」（LR(0) 核相同）的状态合并，压缩成 LALR(1) 自动机。',
    en: 'Merge LR(1) item-set states sharing the same LR(0) core to obtain the compact LALR(1) automaton.',
  },
  description: {
    zh: 'LR(1) 自动机状态数远多于 LR(0)（指数级膨胀），但很多状态拥有相同的 LR(0) 项目核、只是 lookahead 集不同。LALR(1) 把所有「同心」状态合并：核相同的 LR(1) 状态归为一组，每组的项目 lookahead 集取并集。这样 LALR(1) 状态数与 LR(0) 相同，却保留了规约时的 lookahead 精度（介于 SLR 与 LR(1) 之间）。本实现构造 LR(1) 项目集，按核分组，演示合并过程，并报告合并后可能新引入的 reduce/reduce 冲突（LALR 比 LR(1) 强弱正好体现在此）。',
    en: 'The LR(1) automaton has far more states than LR(0) (exponential blow-up), but many share the same LR(0) core and differ only in lookaheads. LALR(1) merges all "same-core" states: group LR(1) states by core, then union the lookahead sets per item within each group. The LALR(1) automaton has the same state count as LR(0) while keeping lookahead precision on reductions (between SLR and LR(1)). This implementation builds LR(1) item sets, groups by core, demonstrates the merge, and reports any reduce/reduce conflicts newly introduced (which is exactly where LALR is weaker than LR(1)).',
  },
  tags: ['parsing', 'lalr', 'lr1', 'automata', 'merge'],
  complexity: { time: 'O(|states|·|items|)', space: 'O(|states|·|items|)' },
};
