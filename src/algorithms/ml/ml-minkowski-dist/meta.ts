// 明可夫斯基距离 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-minkowski-dist',
  categoryId: 'ml',
  title: { zh: '明可夫斯基距离', en: 'Minkowski Distance' },
  summary: { zh: '欧氏/曼哈顿距离的推广 L_p。', en: 'Generalization of Euclidean/Manhattan: L_p.' },
  description: {
    zh: 'L_p(a,b)=(Σ|aᵢ-bᵢ|ᵖ)^(1/p)。p=1 曼哈顿，p=2 欧氏。',
    en: 'L_p=(Σ|aᵢ-bᵢ|ᵖ)^(1/p); p=1 Manhattan, p=2 Euclidean.',
  },
  tags: ['ml', 'distance'],
  complexity: { time: 'O(d)', space: 'O(1)' },
};
