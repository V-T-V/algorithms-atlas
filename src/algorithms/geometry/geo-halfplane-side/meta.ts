// 点在半平面侧 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'geo-halfplane-side',
  categoryId: 'geometry',
  title: { zh: '点在半平面侧', en: 'Half-Plane Side Test' },
  summary: {
    zh: '判断点在有向直线 ab 的哪一侧。',
    en: 'Which side of directed line ab a point lies on.',
  },
  description: {
    zh: '叉积 (b-a)×(p-a)：>0 在左侧，<0 在右侧，=0 共线。',
    en: 'Cross (b-a)×(p-a): positive=left, negative=right, zero=collinear.',
  },
  tags: ['geometry', 'half-plane'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
