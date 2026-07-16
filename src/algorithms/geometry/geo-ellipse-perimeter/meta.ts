// 椭圆周长 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'geo-ellipse-perimeter',
  categoryId: 'geometry',
  title: { zh: '椭圆周长', en: 'Ellipse Perimeter' },
  summary: { zh: '拉马努金近似求椭圆周长。', en: 'Ramanujan approximation of ellipse perimeter.' },
  description: {
    zh: '周长 ≈ π[3(a+b) - √((3a+b)(a+3b))]，拉马努金一阶近似精度极高。',
    en: 'Perimeter ≈ π[3(a+b) - √((3a+b)(a+3b))] (Ramanujan first approximation).',
  },
  tags: ['geometry', 'ellipse', 'approximation'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
