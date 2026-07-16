// LALR(1) Parser · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'lalr-parser',
  categoryId: 'parsing',
  title: { zh: 'LALR(1) 分析器', en: 'LALR(1) Parser' },
  summary: {
    zh: '合并同心 LR(1) 状态（相同 LR(0) 核心）：状态数≈SLR，能力近 LR(1)。',
    en: 'Merge LR(1) states sharing the same LR(0) core: state count near SLR, power near LR(1).',
  },
  description: {
    zh: 'LALR(1)（Look-Ahead LR）分析器在 LR(1) 基础上合并「同心状态」——即 LR(0) 核心项目相同、仅向前看符号不同的多个 LR(1) 状态合并为一个，向前看取并集。这样状态数回落到 SLR/LR(0) 的量级，却保留了 LR(1) 的精确向前看信息（远比 SLR 强），是 YACC/Bison 的默认模式。代价：极少数文法在合并后可能产生 SLR/LR(1) 都没有的「归约-归约」冲突。本实现先构造规范 LR(1) 项目集，再按 LR(0) 核心签名分组合并、传播向前看。',
    en: 'The LALR(1) (Look-Ahead LR) parser merges "core-equivalent" LR(1) states — those sharing the same LR(0) core items but differing only in lookahead — into a single state, taking the union of lookaheads. This brings the state count down to the SLR/LR(0) scale while keeping LR(1)-precise lookahead information (much more powerful than SLR); it is the default mode of YACC/Bison. The cost: a few rare grammars develop reduce-reduce conflicts after merging that neither SLR nor LR(1) had. This implementation builds the canonical LR(1) item sets first, then groups and merges them by LR(0)-core signature, propagating lookaheads.',
  },
  tags: ['parsing', 'bottom-up', 'lr', 'lalr', 'deterministic'],
  complexity: { time: 'O(n)', space: 'O(|states|·|symbols|)' },
};
