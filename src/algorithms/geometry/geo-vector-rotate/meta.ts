// 向量旋转 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'geo-vector-rotate',
  categoryId: 'geometry',
  title: { zh: '向量旋转', en: 'Vector Rotation' },
  summary: {
    zh: '将向量绕原点逆时针旋转角度 θ。',
    en: 'Rotate a vector about the origin counter-clockwise by θ.',
  },
  description: {
    zh: '旋转矩阵：x′=x cosθ - y sinθ, y′=x sinθ + y cosθ。',
    en: 'Rotation: x′=x cosθ - y sinθ, y′=x sinθ + y cosθ.',
  },
  tags: ['geometry', 'vector', 'rotation'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
