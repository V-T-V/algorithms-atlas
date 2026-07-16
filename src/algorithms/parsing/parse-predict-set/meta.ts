// 预测集（PREDICT）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'parse-predict-set',
  categoryId: 'parsing',
  title: { zh: 'PREDICT 预测集', en: 'PREDICT Set' },
  summary: {
    zh: '每条产生式的预测集：FIRST(α) 并（若 α 可空则 FOLLOW(A)）。',
    en: 'Per-production predict set: FIRST(α) unioned with FOLLOW(A) when α is nullable.',
  },
  description: {
    zh: 'PREDICT(A → α) 定义为：FIRST(α) 中除 ε 外的终结符，并上（当 ε ∈ FIRST(α) 时）FOLLOW(A) 的全部终结符（含 $）。直观地说，PREDICT(A→α) 就是「当栈顶是 A、向前看一个终结符 t 时，应该选用这条产生式的所有 t」。LL(1) 文法要求：同一非终结符的任意两条候选的 PREDICT 集互不相交。本实现先算 FIRST、FOLLOW，再对每条产生式算 PREDICT，并报告不相交冲突。',
    en: 'PREDICT(A → α) = (FIRST(α) \\ {ε}) ∪ (FOLLOW(A) if ε ∈ FIRST(α), else ∅). Intuitively it lists every lookahead terminal t with which, given A on the stack, this production should be chosen. An LL(1) grammar requires that for a fixed non-terminal the PREDICT sets of its alternatives be pairwise disjoint. This implementation computes FIRST, FOLLOW, then PREDICT per production, and reports any disjointness conflicts.',
  },
  tags: ['parsing', 'll1', 'first-follow', 'grammar'],
  complexity: { time: 'O(n²)', space: 'O(n·|Σ|)' },
};
