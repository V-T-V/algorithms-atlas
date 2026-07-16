// EBNF 扩展巴科斯 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'parse-ebnf',
  categoryId: 'parsing',
  title: { zh: 'EBNF 扩展巴科斯范式', en: 'EBNF (Extended Backus-Naur Form)' },
  summary: {
    zh: '在 BNF 基础上加入 () 分组、[] 可选、{} 或 * 重复、+ 至少一次等便捷算子。',
    en: 'Extends BNF with () grouping, [] optionality, {}/* repetition, + one-or-more operators.',
  },
  description: {
    zh: 'EBNF（ISO/IEC 14977）在 BNF 之上增加了若干便捷算子：方括号 [] 表示可选（0 或 1 次），花括号 {} 或后缀 * 表示重复（0 次或多次），后缀 + 表示至少一次，圆括号 () 用于分组，逗号或直接连接表示连接。这些算子让文法更紧凑，但每个 EBNF 文法都可机械地展开为等价的纯 BNF（引入新的辅助非终结符）。本实现把 EBNF 规则解析为 AST，并提供「展开为纯 BNF」的转换器。',
    en: 'EBNF (ISO/IEC 14977) augments BNF with convenience operators: [] for optional (0 or 1), {} or suffix * for repetition (0+), suffix + for one-or-more, () for grouping, and concatenation via juxtaposition. These keep grammars compact, and any EBNF grammar can be mechanically desugared into plain BNF by introducing fresh non-terminals. This implementation parses EBNF into an AST and provides a desugaring to plain BNF.',
  },
  tags: ['parsing', 'grammar', 'ebnf', 'context-free'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
