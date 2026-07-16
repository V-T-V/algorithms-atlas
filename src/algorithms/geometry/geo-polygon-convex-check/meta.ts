// 多边形凸性判定 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'geo-polygon-convex-check',
  categoryId: 'geometry',
  title: { zh: '多边形凸性判定', en: 'Polygon Convexity Check' },
  summary: { zh: '判断多边形是否为凸多边形。', en: 'Check whether a polygon is convex.' },
  description: {
    zh: '依次计算相邻三点的叉积符号，若全部同号（或零）则为凸，否则为凹。',
    en: 'Cross products of consecutive triples must all share the same sign for convexity.',
  },
  tags: ['geometry', 'polygon', 'convexity'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
