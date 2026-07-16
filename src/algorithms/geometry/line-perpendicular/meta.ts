// 过点作直线垂线 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'geometry-line-perpendicular',
  categoryId: 'geometry',
  title: { zh: '过点作直线的垂线', en: 'Perpendicular Line Through Point' },
  summary: {
    zh: '过点 P 作直线 AB 的垂线：法向量为 AB 方向，方程为 (x−Px)·dx + (y−Py)·dy = 0。',
    en: 'Construct the line through P perpendicular to AB: normal = AB direction.',
  },
  description: {
    zh:
      '过点作直线垂线（Perpendicular Line Through Point）：给定直线 AB 与一点 P，' +
      '求过 P 且垂直于 AB 的直线方程。' +
      '\n- 直线 AB 方向向量 d = (Bx−Ax, By−Ay)。' +
      '\n- 所求垂线的「法向量」即为 d（因垂线方向垂直于 d）。' +
      '\n- 点法式方程：(x − Px)·dx + (y − Py)·dy = 0。' +
      '\n- 垂足 H = P − ((d·(P−A)) / |d|²) · d。' +
      '\n时间 `O(1)`，空间 `O(1)`。',
    en:
      'Perpendicular Line Through Point: given line AB and point P, find the line through P perpendicular to AB. ' +
      '\n- Direction of AB: d = (Bx−Ax, By−Ay). ' +
      "\n- The perpendicular line's normal vector is d (its direction is perpendicular to d). " +
      '\n- Point-normal equation: (x − Px)·dx + (y − Py)·dy = 0. ' +
      '\n- Foot of perpendicular H = P − ((d·(P−A)) / |d|²) · d. ' +
      '\nTime O(1), space O(1).',
  },
  tags: ['geometry', 'line', 'perpendicular', 'projection'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
