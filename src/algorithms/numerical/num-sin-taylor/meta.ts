// sin 泰勒级数 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'num-sin-taylor',
  categoryId: 'numerical',
  title: { zh: 'sin 泰勒级数', en: 'Sine Taylor Series' },
  summary: { zh: '用泰勒级数近似 sin x。', en: 'Approximate sin x via Taylor series.' },
  description: { zh: 'sin x=x-x³/3!+x⁵/5!-...', en: 'sin x=x-x³/3!+x⁵/5!-...' },
  tags: ['numerical', 'series', 'trigonometry'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
