// 圆弧弧长 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'geo-arc-length-calc',
  categoryId: 'geometry',
  title: { zh: '圆弧弧长', en: 'Arc Length' },
  summary: {
    zh: '由半径与圆心角（弧度）求弧长。',
    en: 'Arc length given radius and central angle (radians).',
  },
  description: { zh: '弧长 = r · θ。', en: 'Arc length = r · θ.' },
  tags: ['geometry', 'circle', 'arc'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
