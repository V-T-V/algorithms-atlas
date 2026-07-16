// 余弦相似度 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-cosine-sim',
  categoryId: 'ml',
  title: { zh: '余弦相似度', en: 'Cosine Similarity' },
  summary: {
    zh: '用夹角余弦衡量向量方向相似性。',
    en: 'Cosine of angle between vectors measures directional similarity.',
  },
  description: {
    zh: 'cos(a,b)=(a·b)/(|a||b|) ∈ [-1,1]。',
    en: 'cos(a,b)=(a·b)/(|a||b|), in [-1,1].',
  },
  tags: ['ml', 'distance'],
  complexity: { time: 'O(d)', space: 'O(1)' },
};
