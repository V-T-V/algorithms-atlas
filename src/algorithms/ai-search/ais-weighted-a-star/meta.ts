// 加权 A*（Weighted A*）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ais-weighted-a-star',
  categoryId: 'ai-search',
  title: { zh: '加权 A*', en: 'Weighted A*' },
  summary: { zh: 'f=g+W·h 的贪心增强版 A*。', en: 'A* with f=g+W·h, more greedy.' },
  description: {
    zh: 'Weighted A* 用 f=g+Wh(W>1)使搜索偏向目标，速度更快但解可能次优，W=1 退化为 A*。',
    en: 'Weighted A* uses f=g+W·h (W>1) to bias toward the goal; faster but possibly suboptimal; W=1 reduces to A*.',
  },
  tags: ['ai-search', 'weighted-a-star', 'heuristic'],
  complexity: { time: 'O(b^d)', space: 'O(n)' },
};
