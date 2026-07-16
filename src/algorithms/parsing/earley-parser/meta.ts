// Earley Parser · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'earley-parser',
  categoryId: 'parsing',
  title: { zh: 'Earley 分析器', en: 'Earley Parser' },
  summary: {
    zh: '任意 CFG 的 O(n³) 分析：在每个位置建立状态集，扫描/完成/预测三步。',
    en: 'An O(n³) parser for any CFG: build a state set at each position via scan, complete, and predict.',
  },
  description: {
    zh: 'Earley 分析器（Jay Earley 1970）能在任意上下文无关文法（CFG）上做识别与解析，时间 O(n³)（无歧义文法 O(n²)、确定文法 O(n)）。它在输入的每个位置 k（0..n）维护一个「状态集」S_k，每个状态形如 A → α·β (i)，表示用产生式 A→αβ 推导、已匹配 α、起源于位置 i。算法对每个状态集反复执行三种操作：扫描（点后是终结符且匹配下一 token 时推进到下一集）、完成（点在末尾时，把起源集中等待该非终结符的状态推进）、预测（点后是非终结符时，把它的所有产生式加入当前集）。最终若起始符的完成状态出现在 S_n 则接受。',
    en: 'The Earley parser (Jay Earley 1970) recognizes and parses any context-free grammar in O(n³) time (O(n²) for unambiguous, O(n) for deterministic grammars). It maintains a state set S_k at each input position k (0..n); each state has the form A → α·β (i), meaning production A→αβ has matched α and originated at position i. For each state set the algorithm repeatedly applies three operations: scan (when the dot precedes a terminal matching the next token, advance it into the next set), complete (when the dot is at the end, advance states in the origin set that waited for this non-terminal), and predict (when the dot precedes a non-terminal, add its productions to the current set). The input is accepted if a completed start-symbol state appears in S_n.',
  },
  tags: ['parsing', 'cfg', 'chart-parsing', 'recognition'],
  complexity: { time: 'O(n³)', space: 'O(n²)' },
};
