// 向量夹角 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'geo-vector-angle',
  categoryId: 'geometry',
  title: { zh: '向量夹角', en: 'Vector Angle' },
  summary: {
    zh: '用点积公式求两向量夹角（弧度）。',
    en: 'Angle between two vectors via the dot-product formula.',
  },
  description: {
    zh: '两向量 a、b 的夹角 θ 满足 cos θ = (a·b)/(|a||b|)，θ ∈ [0, π]。',
    en: 'cos θ = (a·b)/(|a||b|), θ ∈ [0, π].',
  },
  tags: ['geometry', 'vector', 'angle'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
