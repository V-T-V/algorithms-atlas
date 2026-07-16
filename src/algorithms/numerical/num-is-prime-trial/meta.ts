// 试除判素 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'num-is-prime-trial',
  categoryId: 'numerical',
  title: { zh: '试除判素', en: 'Trial-Division Primality' },
  summary: { zh: '用试除法判断素数。', en: 'Test primality by trial division.' },
  description: {
    zh: '试除 2..√n，整除即为合数。',
    en: 'Try divisors 2..√n; any divisor means composite.',
  },
  tags: ['numerical', 'prime'],
  complexity: { time: 'O(√n)', space: 'O(1)' },
};
