// 正则 AST 构建 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'parse-regex-ast',
  categoryId: 'parsing',
  title: { zh: '正则表达式 AST 构建', en: 'Regex AST Construction' },
  summary: {
    zh: '递归下降解析正则字符串为抽象语法树（连接/选择/星/加/问/字面）。',
    en: 'Recursive-descent parse of a regex string into an AST (concat / alt / star / plus / opt / literal).',
  },
  description: {
    zh: '把正则表达式字符串解析为抽象语法树是后续转 NFA/DFA、做模式匹配或最小化的基础。本实现支持：连接（直接相邻）、选择 |、后缀 *（Kleene 闭包，0+ 次）、+（1+ 次）、?（0/1 次）、括号分组、.（任意字符）、字符类 [abc] 与 [a-z]（区间）、转义反斜杠。文法为：alt := concat (| concat)*；concat := rep+；rep := atom (* | + | ?)?；atom := literal | ( alt ) | [ class ] | .。',
    en: 'Parsing a regex string into an AST is the foundation for NFA/DFA conversion, pattern matching, and minimization. This implementation supports: concatenation (juxtaposition), alternation |, suffix * (Kleene star, 0+), + (1+), ? (0/1), parentheses for grouping, . (any char), character classes [abc] and ranges [a-z], and escaping backslash. Grammar: alt := concat (| concat)*; concat := rep+; rep := atom (* | + | ?)?; atom := literal | ( alt ) | [ class ] | .',
  },
  tags: ['parsing', 'regex', 'ast', 'recursive-descent'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
