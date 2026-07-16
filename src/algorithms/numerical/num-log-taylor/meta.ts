// ln 的泰勒级数 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'num-log-taylor',
  categoryId: 'numerical',
  title: { zh: 'ln 的泰勒级数', en: 'Natural Log Taylor Series' },
  summary: { zh: '用泰勒级数近似 ln(1+x)。', en: 'Approximate ln(1+x) via Taylor series.' },
  description: {
    zh: 'ln(1+x)=x-x²/2+x³/3-...，对 |x|<1 收敛。',
    en: 'ln(1+x)=x-x²/2+x³/3-...; converges for |x|<1.',
  },
  tags: ['numerical', 'series'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
