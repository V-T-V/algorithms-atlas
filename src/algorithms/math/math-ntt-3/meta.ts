import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'math-ntt-3',
  categoryId: 'math',
  title: { zh: '数论变换 NTT（998244353）', en: 'Number-Theoretic Transform (NTT)' },
  summary: {
    zh: '在模 998244353 下用原根 3 做快速数论变换实现多项式乘法。',
    en: 'Fast NTT under modulus 998244353 with primitive root 3 for polynomial multiplication.',
  },
  description: {
    zh: '998244353 = 119·2²³+1，原根 g=3。NTT 类似 FFT 但所有运算在模意义下，无浮点误差。位逆序 + 蝶形运算。',
    en: '998244353 = 119·2²³+1, g=3. NTT mirrors FFT but operates in modular arithmetic — no float error.',
  },
  tags: ['math', 'ntt', 'polynomial'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
