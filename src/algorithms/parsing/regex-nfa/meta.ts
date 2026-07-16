// Regex → NFA (Thompson) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'regex-nfa',
  categoryId: 'parsing',
  title: { zh: '正则→NFA (Thompson 构造)', en: 'Regex → NFA (Thompson Construction)' },
  summary: {
    zh: 'Thompson 构造：把正则（拼接/选择/星号）转为等价的 ε-NFA。',
    en: 'Thompson construction: convert a regex (concat / alternation / star) to an equivalent ε-NFA.',
  },
  description: {
    zh: 'Thompson 构造法把正则表达式递归地转换为带 ε 转移的非确定有限自动机（ε-NFA）。对每个基本字符、连接、选择（|）、Kleene 星号（*）给出固定形状的子 NFA 模板，再组合起来。结果 NFA 的状态数与正则长度成线性关系，每个子表达式恰好对应两个新状态（起、止）。本实现含一个简单的正则解析器（递归下降，处理优先级：星号 > 拼接 > 选择），随后用 Thompson 算法生成 NFA，并提供 ε-闭包模拟匹配。',
    en: 'Thompson construction recursively converts a regex into an ε-NFA with epsilon transitions. For each base character, concatenation, alternation (|), and Kleene star (*) it builds a fixed-shape sub-NFA template and composes them. The resulting NFA has a linear number of states in the regex length, each sub-expression contributing exactly two new states (start and accept). This implementation includes a simple recursive-descent regex parser (precedence: star > concat > alternation), then Thompson construction, and an ε-closure based match simulator.',
  },
  tags: ['parsing', 'regex', 'automata', 'nfa', 'thompson'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
