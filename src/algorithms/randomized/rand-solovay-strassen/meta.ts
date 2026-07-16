// Solovay-Strassen 检验 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rand-solovay-strassen',
  categoryId: 'randomized',
  title: { zh: 'Solovay-Strassen 检验', en: 'Solovay-Strassen Test' },
  summary: { zh: 'Jacobi 符号概率素性检验。', en: 'Jacobi-symbol probabilistic primality test.' },
  description: {
    zh: '比费马更严格，无 Carmichael 漏检。',
    en: 'Stricter than Fermat; no Carmichael miss.',
  },
  tags: ['randomized', 'prime'],
  complexity: { time: 'O(k·log n)', space: 'O(1)' },
};
