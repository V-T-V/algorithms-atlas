// Lexer Generator · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'lexer-generator',
  categoryId: 'parsing',
  title: { zh: '词法分析器生成器（NFA→DFA）', en: 'Lexer Generator (NFA→DFA)' },
  summary: {
    zh: '词法分析器生成器把一组「token 规则」（正则式 → 类型）先编译为 NFA，再用子集构造法转为 DFA，最后对输入做最长匹配扫描。',
    en: 'A lexer generator compiles a set of token rules (regex → kind) into an NFA, converts it to a DFA via subset construction, then scans input with longest-match.',
  },
  description: {
    zh: '本算法模拟 lex/flex 的核心：(1) 每条规则用 Thompson 构造法转为 ε-NFA，并联到同一起始状态；(2) 用子集构造（subset construction）把 ε-NFA 确定化为 DFA，每状态记录是否为接受态及对应的 token 类型（按规则优先级，先列出的优先）；(3) 对输入做最长匹配扫描：从初始状态出发，尽量多读字符直到无可转移，回退到最后一个接受态输出 token。支持字符类 [a-z]、连接、选择 |、星号 *、加号 +、可选 ?。零 DOM 依赖，可独立单测。',
    en: "This algorithm emulates lex/flex's core: (1) each rule is converted to an ε-NFA via Thompson's construction, all merged under a common start state; (2) the ε-NFA is determinized to a DFA via subset construction, each state recording whether it is accepting and which token kind (by rule priority—earliest listed wins); (3) input is scanned with longest-match: from the start state, read as many characters as possible until no transition exists, then roll back to the last accepting state to emit a token. Supports character classes [a-z], concatenation, alternation |, star *, plus +, optional ?. Zero DOM dependencies, independently unit-testable.",
  },
  tags: ['parsing', 'lexer', 'nfa', 'dfa', 'regex'],
  complexity: { time: 'O(n)', space: 'O(|Σ|·|DFA|)' },
};
