// 二维蒙特卡洛积分 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rand-monte-carlo-integration-2d',
  categoryId: 'randomized',
  title: { zh: '二维蒙特卡洛积分', en: '2D Monte Carlo Integration' },
  summary: {
    zh: '在矩形内均匀采样，用命中比例 × 面积 估计二元函数积分。',
    en: 'Uniformly sample a rectangle; estimate the integral of a 2D function as hit-ratio × area.',
  },
  description: {
    zh: '对定义在 [x0,x1]×[y0,y1] 上 0/1 指示函数（如单位圆内）的积分，蒙特卡洛法：均匀投 N 点，命中比例 × 矩形面积 → 估计值。方差随 1/√N 下降。',
    en: 'For an indicator function on [x0,x1]×[y0,y1] (e.g., inside the unit circle), Monte Carlo: throw N uniform points; hit-ratio × rectangle area estimates the integral. Variance falls as 1/√N.',
  },
  tags: ['randomized', 'monte-carlo', 'numerical-integration'],
  complexity: { time: 'O(N)', space: 'O(1)' },
};
