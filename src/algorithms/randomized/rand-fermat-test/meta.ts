// 费马素性检验 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rand-fermat-test',
  categoryId: 'randomized',
  title: { zh: '费马素性检验', en: 'Fermat Primality Test' },
  summary: {
    zh: '费马小定理概率素性检验。',
    en: "Probabilistic primality via Fermat's little theorem.",
  },
  description: {
    zh: 'a^(n-1) ≡ 1 (mod n) 对素数成立。',
    en: 'a^(n-1) ≡ 1 (mod n) holds for primes.',
  },
  tags: ['randomized', 'prime'],
  complexity: { time: 'O(k·log n)', space: 'O(1)' },
};
