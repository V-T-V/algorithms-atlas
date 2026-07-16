// 转义序列解析 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'escape-sequence-parser',
  categoryId: 'parsing',
  title: { zh: '转义序列解析', en: 'Escape Sequence Parser' },
  summary: {
    zh: '解析反斜杠转义：\\n \\t \\\\ \\" \\xHH \\uHHHH 等。',
    en: 'Parse backslash escapes: \\n \\t \\\\ \\" \\xHH \\uHHHH etc.',
  },
  description: {
    zh: '解析字符串字面量中的转义序列（C/JSON 风格）。逐字符扫描：\n- 遇到 \\ 进入转义态\n- 后接字母：映射常用转义（n→换行、t→制表、r→回车、\\、"、\'、0）\n- \\xHH：两位十六进制\n- \\uHHHH：四位十六进制 Unicode\n\n输出实际字符序列。是词法/字符串处理的基础组件。',
    en: 'Parse escape sequences (C/JSON style) in a string literal: backslash enters escape mode; a following letter maps to common escapes (n→newline, t→tab, r→CR, \\, ", \', 0); \\xHH is two hex digits; \\uHHHH is four hex digits for Unicode. Outputs the real character sequence.',
  },
  tags: ['parsing', 'escape', 'string', 'lexer'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
