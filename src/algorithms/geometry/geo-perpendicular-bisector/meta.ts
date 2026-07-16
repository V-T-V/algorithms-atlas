// 中垂线 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'geo-perpendicular-bisector',
  categoryId: 'geometry',
  title: { zh: '中垂线', en: 'Perpendicular Bisector' },
  summary: {
    zh: '求线段 ab 的中垂线（直线方程 ax+by+c=0）。',
    en: 'Perpendicular bisector of segment ab as line equation ax+by+c=0.',
  },
  description: {
    zh: '中点 M，垂线方向为 (dy, -dx)（垂直于 ab 方向）。',
    en: 'Through midpoint M, normal direction is along ab; equation derived.',
  },
  tags: ['geometry', 'line'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
