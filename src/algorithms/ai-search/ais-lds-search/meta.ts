// 有限偏差搜索 LDS（Limited Discrepancy Search）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ais-lds-search',
  categoryId: 'ai-search',
  title: { zh: '有限偏差搜索 LDS', en: 'Limited Discrepancy Search' },
  summary: { zh: '限制偏离启发式选择的次数。', en: 'Bounded deviations from heuristic choice.' },
  description: {
    zh: 'LDS(Harvey & Ginsberg)限制搜索过程中「不跟随启发式选择」的次数，逐轮放宽，先信任启发式。',
    en: 'LDS bounds how often the search may deviate from the heuristic; the bound increases per round, trusting the heuristic first.',
  },
  tags: ['ai-search', 'lds', 'heuristic'],
  complexity: { time: 'O(b^d)', space: 'O(d)' },
};
