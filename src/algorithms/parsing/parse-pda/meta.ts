import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'parse-pda',
  categoryId: 'parsing',
  title: { zh: '下推自动机', en: 'Pushdown Automaton (PDA)' },
  summary: {
    zh: '带栈的有限自动机，识别上下文无关语言。',
    en: 'A finite automaton augmented with a stack; recognizes context-free languages.',
  },
  description: {
    zh: 'PDA 每步依状态、输入、栈顶决定动作：替换栈顶并转移。识别 aⁿbⁿ 等 CFL。',
    en: 'A PDA transitions based on state, input symbol, and top-of-stack; recognizes languages like aⁿbⁿ.',
  },
  tags: ['parsing', 'automaton', 'stack', 'cfl'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
