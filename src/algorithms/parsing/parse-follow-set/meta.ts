// FOLLOW 集计算 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'parse-follow-set',
  categoryId: 'parsing',
  title: { zh: 'FOLLOW 集计算', en: 'FOLLOW Set Computation' },
  summary: {
    zh: '不动点迭代求每个非终结符在某个句型中可紧随的终结符集。',
    en: 'Fixpoint iteration for the terminal set that may immediately follow each non-terminal.',
  },
  description: {
    zh: 'FOLLOW(A) = { a | S ⇒* α A a β }；约定 $ ∈ FOLLOW(起始符)。计算依赖已求出的 FIRST 集，用不动点迭代：FOLLOW(起始) 加入 $；对每条产生式 A → α B β：把 FIRST(β){ε} 并入 FOLLOW(B)；若 β ⇒* ε（或 β 为空），则把 FOLLOW(A) 并入 FOLLOW(B)。反复扫描直到无变化。FOLLOW 集用于决定 ε 产生式何时被选用（填入分析表的 FOLLOW 列）。',
    en: 'FOLLOW(A) = { a | S ⇒* α A a β }; by convention $ ∈ FOLLOW(start). Computation needs the FIRST sets and runs a fixpoint: add $ to FOLLOW(start); for each production A → α B β, union FIRST(β){ε} into FOLLOW(B); if β ⇒* ε (or β is empty), union FOLLOW(A) into FOLLOW(B). Repeat until stable. FOLLOW sets decide when ε-productions are chosen (filled into the FOLLOW columns of the parse table).',
  },
  tags: ['parsing', 'first-follow', 'grammar', 'fixpoint'],
  complexity: { time: 'O(n²)', space: 'O(n·|Σ|)' },
};
