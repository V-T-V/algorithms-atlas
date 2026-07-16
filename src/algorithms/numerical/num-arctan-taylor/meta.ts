// arctan 泰勒级数 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'num-arctan-taylor',
  categoryId: 'numerical',
  title: { zh: 'arctan 泰勒级数', en: 'Arctangent Taylor Series' },
  summary: { zh: '用泰勒级数近似 arctan x。', en: 'Approximate arctan x via Taylor series.' },
  description: {
    zh: 'arctan x=x-x³/3+x⁵/5-...，对 |x|≤1 收敛。',
    en: 'arctan x=x-x³/3+x⁵/5-...; converges for |x|≤1.',
  },
  tags: ['numerical', 'series', 'trigonometry'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
