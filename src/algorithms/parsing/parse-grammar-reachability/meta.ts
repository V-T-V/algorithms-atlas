import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'parse-grammar-reachability',
  categoryId: 'parsing',
  title: { zh: '文法可达性', en: 'Grammar Reachability Analysis' },
  summary: {
    zh: '找出文法中可达与不可达非终结符，便于裁剪无用产生式。',
    en: 'Find reachable vs unreachable non-terminals to prune useless productions.',
  },
  description: {
    zh: '从起始符 BFS：能到达的为可达；其余不可达可删。',
    en: 'BFS from start: reachable non-terminals are kept; the rest can be removed.',
  },
  tags: ['parsing', 'grammar', 'analysis'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
