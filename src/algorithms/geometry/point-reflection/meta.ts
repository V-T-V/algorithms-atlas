// 点对称（点反射）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'geometry-point-reflection',
  categoryId: 'geometry',
  title: { zh: '点对称（点反射）', en: 'Point Reflection' },
  summary: {
    zh: "求点 P 关于中心 C 的对称点：P' = 2C − P。",
    en: "Reflect point P across center C: P' = 2C − P.",
  },
  description: {
    zh:
      '点对称（Point Reflection / Central Symmetry）：给定中心点 C 与点 P，' +
      "求 P 关于 C 的对称点 P'，使 C 成为 PP' 的中点。" +
      "\n- 公式：P' = 2C − P，即 `(2*Cx − Px, 2*Cy − Py)`。" +
      '\n- 性质：再反射一次回到原点（自反）；保持距离、反向。' +
      '\n- 应用：图形中心镜像、180° 旋转、对称图案构造。' +
      '\n时间 `O(1)`，空间 `O(1)`。',
    en:
      'Point Reflection (Central Symmetry): given a center C and a point P, ' +
      "find P' symmetric to P about C so that C is the midpoint of PP'. " +
      "\n- Formula: P' = 2C − P, i.e. (2*Cx − Px, 2*Cy − Py). " +
      '\n- Properties: applying twice returns the original; distance-preserving, orientation-reversing. ' +
      '\n- Applications: central mirroring, 180° rotation, symmetric pattern design. ' +
      '\nTime O(1), space O(1).',
  },
  tags: ['geometry', 'transformation', 'reflection', 'symmetry'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
