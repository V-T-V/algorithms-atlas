// exp 泰勒级数 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'num-exp-taylor',
  categoryId: 'numerical',
  title: { zh: 'exp 泰勒级数', en: 'Exponential Taylor Series' },
  summary: { zh: '用泰勒级数近似 e^x。', en: 'Approximate e^x via Taylor series.' },
  description: { zh: 'e^x=1+x+x²/2!+x³/3!+...', en: 'e^x=1+x+x²/2!+x³/3!+...' },
  tags: ['numerical', 'series'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
