// 向量投影 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'geo-vector-projection',
  categoryId: 'geometry',
  title: { zh: '向量投影', en: 'Vector Projection' },
  summary: { zh: '将向量 a 投影到向量 b 上。', en: 'Project vector a onto vector b.' },
  description: {
    zh: '投影 proj_b(a) = (a·b / b·b) b。返回标量系数与投影向量。',
    en: 'proj_b(a) = (a·b / b·b) b. Returns scalar coefficient and projected vector.',
  },
  tags: ['geometry', 'vector', 'projection'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
