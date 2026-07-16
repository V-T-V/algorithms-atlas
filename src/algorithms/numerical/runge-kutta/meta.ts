// Runge-Kutta RK4 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'runge-kutta',
  categoryId: 'numerical',
  title: { zh: '龙格-库塔法 RK4', en: 'Runge-Kutta RK4' },
  summary: {
    zh: '龙格-库塔法 RK4属于numerical类别。',
    en: 'Runge-Kutta RK4 is a numerical algorithm.',
  },
  description: {
    zh: '龙格-库塔法 RK4（Runge-Kutta RK4）属于numerical类别的算法。',
    en: 'Runge-Kutta RK4 is an algorithm in the numerical category.',
  },
  tags: ["numerical","numerical-method"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
