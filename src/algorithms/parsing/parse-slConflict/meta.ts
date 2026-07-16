// SLR 冲突检测 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'parse-slConflict',
  categoryId: 'parsing',
  title: { zh: 'SLR(1) 冲突检测', en: 'SLR(1) Conflict Detection' },
  summary: {
    zh: '在 LR(0) 项目集规范族 + SLR FOLLOW 集上检测 shift/reduce 与 reduce/reduce 冲突。',
    en: 'Detect shift/reduce and reduce/reduce conflicts on the LR(0) automaton with SLR FOLLOW sets.',
  },
  description: {
    zh: 'SLR(1) 分析器在 LR(0) 自动机的基础上，用 FOLLOW 集决定「规约」动作的适用列。冲突有两类：(1) 移进-规约冲突——同一状态对终结符 a 既可移进（有项目 [A→α·aβ]）又可规约（有项目 [B→γ·] 且 a ∈ FOLLOW(B)）；(2) 规约-规约冲突——同一状态有两个完成项目 [A→α·]、[B→β·] 且 FOLLOW(A) ∩ FOLLOW(B) ≠ ∅。本实现构造 LR(0) 项目集规范族，计算 FOLLOW，扫描所有状态报告冲突。有冲突说明文法不是 SLR(1)（可能需要 LALR/LR(1)）。',
    en: 'An SLR(1) parser augments the LR(0) automaton with FOLLOW sets to decide which columns a reduce applies to. Two conflict kinds: (1) shift/reduce — same state can shift a (item [A→α·aβ]) and reduce (item [B→γ·] with a ∈ FOLLOW(B)); (2) reduce/reduce — same state has two complete items [A→α·], [B→β·] with overlapping FOLLOW sets. This implementation builds the LR(0) item-set family, computes FOLLOW, and scans every state for conflicts. Any conflict means the grammar is not SLR(1) (may need LALR/LR(1)).',
  },
  tags: ['parsing', 'slr', 'lr0', 'conflict', 'grammar'],
  complexity: { time: 'O(|states|·|Σ|)', space: 'O(|states|·|items|)' },
};
