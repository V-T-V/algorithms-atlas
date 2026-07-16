import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'parse-lexer-state',
  categoryId: 'parsing',
  title: { zh: '状态词法分析器', en: 'Stateful Lexer' },
  summary: {
    zh: '支持状态切换的词法分析器：不同上下文使用不同规则集。',
    en: 'A lexer that switches rule sets based on a current state.',
  },
  description: {
    zh: '每状态一组 (pattern, action)；action 可改状态（如遇 " 进入字符串态）。',
    en: 'Each state has its own rules; matching tokens may change the lexer state.',
  },
  tags: ['parsing', 'lexer', 'stateful'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
