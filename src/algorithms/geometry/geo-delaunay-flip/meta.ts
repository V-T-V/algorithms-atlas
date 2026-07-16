// Delaunay 翻转 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'geo-delaunay-flip',
  categoryId: 'geometry',
  title: { zh: 'Delaunay 翻转', en: 'Delaunay Edge Flip' },
  summary: {
    zh: '用 incircle 判定检测非法边，翻转使其满足 Delaunay 性质。',
    en: 'Detect illegal edges via the in-circle test and flip them to satisfy the Delaunay property.',
  },
  description: {
    zh: 'Delaunay 翻转：给定两个共享对角边 AC 的三角形 ABC 与 ACD，若 D 落在 △ABC 的外接圆内，则边 AC 是「非法」的，应翻转为 BD。\n\n判定用 incircle 行列式：对 CCW 的 A,B,C 与点 D，构造 3×3 行列式 |Ax-Dx, Ay-Dy, (Ax-Dx)²+(Ay-Dy)²; Bx-Dx, By-Dy, ...; Cx-Dx, Cy-Dy, ...| > 0 表示 D 在外接圆内 → 非法。\n\n反复翻转直到没有非法边即得 Delaunay 三角剖分。复杂度单次翻转 O(1)，整体 O(n²)。',
    en: 'Delaunay edge flip: two triangles ABC, ACD sharing diagonal AC. If D lies inside the circumcircle of CCW △ABC (in-circle determinant > 0), edge AC is illegal and is flipped to BD. Repeating until no illegal edge remains yields the Delaunay triangulation. O(1) per flip, O(n²) overall.',
  },
  tags: ['geometry', 'delaunay', 'triangulation', 'incircle', 'flip'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
