// Beam Stack Search（Beam Stack Search）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ais-beam-stack',
  categoryId: 'ai-search',
  title: { zh: 'Beam Stack Search', en: 'Beam Stack Search' },
  summary: { zh: '可回溯的束搜索变体。', en: 'Backtrackable beam search.' },
  description: {
    zh: 'Beam Stack(Zhou & Hansen)在束搜索基础上保留被剪枝的次优层，使搜索能在失败时回溯而非终止。',
    en: 'Beam Stack keeps pruned suboptimal layers so beam search can backtrack rather than terminate on failure.',
  },
  tags: ['ai-search', 'beam-search', 'backtracking'],
  complexity: { time: 'O(b*w*d)', space: 'O(w*d)' },
};
