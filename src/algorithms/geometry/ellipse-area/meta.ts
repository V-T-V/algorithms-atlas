// 椭圆面积 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'geometry-ellipse-area',
  categoryId: 'geometry',
  title: { zh: '椭圆面积', en: 'Ellipse Area' },
  summary: {
    zh: '椭圆面积 A = π · a · b（a、b 为半长轴、半短轴）；由离心率 e 可换算。',
    en: 'Ellipse area A = π · a · b (a, b are semi-axes); convertible via eccentricity e.',
  },
  description: {
    zh:
      '椭圆面积（Ellipse Area）：给定半长轴 a 与半短轴 b（a ≥ b > 0），椭圆面积为 `A = π · a · b`。' +
      '\n- 当 a = b = r 时退化为圆面积 π·r²。' +
      '\n- 离心率 `e = √(1 − (b²/a²))`；由 e 与 a 反推 b = a·√(1 − e²)。' +
      '\n- 周长无初等闭式，需用拉马努金近似：`C ≈ π·[3(a+b) − √((3a+b)(a+3b))]`。' +
      '\n时间 `O(1)`，空间 `O(1)`。',
    en:
      'Ellipse Area: given semi-major axis a and semi-minor axis b (a ≥ b > 0), area = π · a · b. ' +
      '\n- Reduces to circle area π·r² when a = b = r. ' +
      '\n- Eccentricity e = √(1 − (b²/a²)); invert to get b = a·√(1 − e²). ' +
      "\n- Perimeter has no closed form; use Ramanujan's approximation: C ≈ π·[3(a+b) − √((3a+b)(a+3b))]. " +
      '\nTime O(1), space O(1).',
  },
  tags: ['geometry', 'ellipse', 'area', 'conic'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
