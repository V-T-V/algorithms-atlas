// DFA 词法分析器 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'tokenizer-dfa',
  categoryId: 'parsing',
  title: { zh: 'DFA 词法分析器', en: 'DFA Tokenizer' },
  summary: {
    zh: '用确定有限自动机逐字符扫描，把源码切成记号流。',
    en: 'Scan source character-by-character with a DFA to produce a token stream.',
  },
  description: {
    zh: '词法分析（Lexing）是编译/解析的第一步，把字符流切分为记号（token）流。本实现用确定有限自动机（DFA）逐字符扫描：\n- 起始状态，遇到字母/下划线进入「标识符」态，连续读字母数字\n- 遇到数字进入「数字」态\n- 遇到运算符（+-*/=<>等）进入「运算符」态\n- 空白跳过\n- 每次状态终结时发射一个 token\n\n支持：标识符、整数、运算符、标点。',
    en: 'Lexing splits a character stream into tokens. This DFA scanner: start state; letters/underscore begin an identifier (continue alphanumerics); digits begin a number; operators/punctuation form single-char tokens; whitespace is skipped. Emits a token on each state exit.',
  },
  tags: ['parsing', 'lexer', 'dfa', 'tokenizer', 'compiler'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
