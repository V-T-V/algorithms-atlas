// FIRST 集计算 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'parse-first-set',
  categoryId: 'parsing',
  title: { zh: 'FIRST 集计算', en: 'FIRST Set Computation' },
  summary: {
    zh: '不动点迭代求每个非终结符可推出的首终结符集（含 ε）。',
    en: 'Fixpoint iteration for the leading-terminal set (including ε) of every non-terminal.',
  },
  description: {
    zh: 'FIRST(A) = { a | A ⇒* aα }；若 A ⇒* ε，则 ε ∈ FIRST(A)。计算用不动点迭代：反复扫描所有产生式 A → X1 X2 ... Xk，把 FIRST(X1){ε} 并入 FIRST(A)；若 ε ∈ FIRST(X1)，则继续看 X2，依此类推；若全部 Xi 都可空，则把 ε 加入 FIRST(A)。当一轮扫描不再有变化时停。FIRST 集是构造 LL(1) 分析表、消除回溯、做递归下降预测的基础。',
    en: 'FIRST(A) = { a | A ⇒* aα }; if A ⇒* ε then ε ∈ FIRST(A). Computed by fixpoint iteration: repeatedly scan productions A → X1 X2 ... Xk, union FIRST(X1){ε} into FIRST(A); if ε ∈ FIRST(X1) proceed to X2, and so on; add ε only if every Xi is nullable. Stops when a full scan makes no change. FIRST sets underpin LL(1) table construction, backtracking elimination, and recursive-descent prediction.',
  },
  tags: ['parsing', 'first-follow', 'grammar', 'fixpoint'],
  complexity: { time: 'O(n²)', space: 'O(n·|Σ|)' },
};
