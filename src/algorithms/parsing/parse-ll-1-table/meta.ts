// LL(1) 分析表构建 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'parse-ll-1-table',
  categoryId: 'parsing',
  title: { zh: 'LL(1) 分析表构建', en: 'LL(1) Parse Table Construction' },
  summary: {
    zh: '由 FIRST/FOLLOW 集生成 M[非终结符][终结符] = 产生式的预测分析表。',
    en: 'Build the predictive M[nonterminal][terminal] = production table from FIRST/FOLLOW sets.',
  },
  description: {
    zh: 'LL(1) 分析表是表驱动自顶向下解析的核心数据结构。对每条产生式 A → α：若 FIRST(α) 中含终结符 a，则置 M[A][a] = A → α；若 FIRST(α) 含 ε，则对 FOLLOW(A) 中每个终结符 b（含 $）置 M[A][b] = A → α。若同一格被填两次且产生式不同，说明存在冲突，文法非 LL(1)。本实现输入 CFG（产生式列表），输出分析表 + 冲突报告。',
    en: 'The LL(1) parse table drives table-driven top-down parsing. For each production A → α: if a terminal a is in FIRST(α), set M[A][a] = A → α; if ε ∈ FIRST(α), then for each b in FOLLOW(A) (including $) set M[A][b] = A → α. If a single cell gets two different productions, the grammar has a conflict and is not LL(1). This implementation takes a CFG and outputs the table plus a conflict report.',
  },
  tags: ['parsing', 'll1', 'first-follow', 'grammar', 'table'],
  complexity: { time: 'O(n²·|Σ|)', space: 'O(n·|Σ|)' },
};
