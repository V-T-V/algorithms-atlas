// 点关于点反射 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'geo-reflection-point',
  categoryId: 'geometry',
  title: { zh: '点关于点反射', en: 'Point Reflection About Point' },
  summary: { zh: '求点 P 关于中心 C 的反射点。', en: 'Reflect point P about center C.' },
  description: {
    zh: '反射点 P′ = 2C - P（中心对称）。',
    en: 'Reflected point P′ = 2C - P (central symmetry).',
  },
  tags: ['geometry', 'transformation', 'reflection'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
