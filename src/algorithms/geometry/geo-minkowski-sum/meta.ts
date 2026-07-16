// 闵可夫斯基和 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'geo-minkowski-sum',
  categoryId: 'geometry',
  title: { zh: '闵可夫斯基和', en: 'Minkowski Sum' },
  summary: { zh: '求两个凸多边形的闵可夫斯基和。', en: 'Minkowski sum of two convex polygons.' },
  description: {
    zh: '把两个凸多边形按极角合并所有边向量，得到和的凸多边形。',
    en: 'Merge edge vectors of two convex polygons by polar angle to get the sum polygon.',
  },
  tags: ['geometry', 'polygon', 'minkowski'],
  complexity: { time: 'O(n+m)', space: 'O(n+m)' },
};
