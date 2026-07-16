// 粗到细搜索（Coarse-to-Fine Search）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ais-coarse-to-fine-search',
  categoryId: 'ai-search',
  title: { zh: '粗到细搜索', en: 'Coarse-to-Fine Search' },
  summary: { zh: '先粗粒度搜索再逐层细化。', en: 'Search coarse first, refine progressively.' },
  description: {
    zh: '粗到细搜索先在低分辨率空间找到候选区域，再在该区域以更高分辨率重新搜索，常用于图像匹配、路径规划。',
    en: 'Coarse-to-fine searches a coarse space first then refines within candidate regions at higher resolution.',
  },
  tags: ['ai-search', 'coarse-to-fine', 'hierarchical'],
  complexity: { time: 'O(log R * b^d)', space: 'O(n)' },
};
