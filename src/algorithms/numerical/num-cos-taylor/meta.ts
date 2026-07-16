// cos 泰勒级数 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'num-cos-taylor',
  categoryId: 'numerical',
  title: { zh: 'cos 泰勒级数', en: 'Cosine Taylor Series' },
  summary: { zh: '用泰勒级数近似 cos x。', en: 'Approximate cos x via Taylor series.' },
  description: { zh: 'cos x=1-x²/2!+x⁴/4!-...', en: 'cos x=1-x²/2!+x⁴/4!-...' },
  tags: ['numerical', 'series', 'trigonometry'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
