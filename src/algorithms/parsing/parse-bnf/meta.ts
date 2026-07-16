// BNF 文法表示 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'parse-bnf',
  categoryId: 'parsing',
  title: { zh: 'BNF 文法表示', en: 'BNF Grammar Notation' },
  summary: {
    zh: '巴科斯范式：用 <非终结符> ::= 展开式 描述上下文无关文法。',
    en: 'Backus-Naur Form: describes context-free grammars via <non-terminal> ::= expansion.',
  },
  description: {
    zh: 'BNF（巴科斯-诺尔范式）由 John Backus 与 Peter Naur 为描述 ALGOL 60 而发明，是上下文无关文法（CFG）的经典文本表示。其核心规则形如 `<非终结符> ::= 展开式`，非终结符用尖括号包裹，展开式由终结符与非终结符序列组成，多条候选用 `|` 分隔。BNF 不能直接表达「重复 *」「可选 ?」「分组 ()」等便捷构造，因此派生了 EBNF。本实现把 BNF 文本解析为结构化产生式集合，便于后续构造 FIRST/FOLLOW/分析表。',
    en: 'BNF (Backus-Naur Form), invented by Backus and Naur to describe ALGOL 60, is the classical textual representation of context-free grammars (CFG). Each rule has the form `<non-terminal> ::= expansion`; non-terminals are wrapped in angle brackets and alternatives are separated by `|`. BNF cannot directly express repetition (*), optionality (?), or grouping (), motivating EBNF. This implementation parses BNF text into a structured set of productions.',
  },
  tags: ['parsing', 'grammar', 'bnf', 'context-free'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
