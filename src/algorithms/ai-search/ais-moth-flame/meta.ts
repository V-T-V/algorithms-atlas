// 飞蛾扑火（Moth-Flame Optimization）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ais-moth-flame',
  categoryId: 'ai-search',
  title: { zh: '飞蛾扑火', en: 'Moth-Flame Optimization' },
  summary: {
    zh: '飞蛾横向绕火焰螺旋飞行，火焰数随代递减。',
    en: 'Moths spiral transversely around flames; flame count decreases over generations.',
  },
  description: {
    zh: '飞蛾扑火优化（Mirjalili 2015）：飞蛾按螺旋公式更新 M_i = D_i·e^{bt}·cos(2πt) + F_j。火焰数火焰每代线性递减，平衡探索与开发。本实现最小化 Sphere。',
    en: 'MFO (Mirjalili 2015): moths update by M_i = D_i·e^{bt}·cos(2πt) + F_j. Flame count decreases linearly per generation to balance exploration/exploitation. Minimizes Sphere.',
  },
  tags: ['ai-search', 'swarm', 'optimization', 'moth-flame'],
  complexity: { time: 'O(iter × moths × d)', space: 'O(moths × d)' },
};
