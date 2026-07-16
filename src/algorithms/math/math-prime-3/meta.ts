import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'math-prime-3',
  categoryId: 'math',
  title: { zh: '素数判定（Miller-Rabin）', en: 'Primality Test (Miller-Rabin)' },
  summary: {
    zh: '概率性素数测试，对 64 位以内整数确定性 witnesses 已知。',
    en: 'Probabilistic primality test; deterministic for 64-bit integers with known witness sets.',
  },
  description: {
    zh: '将 n-1 写成 d·2^r。对若干 witness a 检验 a^d mod n 是否为 1 或 -1，并平方 r 次。对 n<3.3e10 用 {2,3,5,7,11,13,17,19,23,29,31,37} 即确定性。',
    en: 'Write n-1=d·2^r. For witness a check a^d mod n is ±1 and square r times. The witness set listed is deterministic for n<3.3e10.',
  },
  tags: ['math', 'prime', 'miller-rabin'],
  complexity: { time: 'O(k log³ n)', space: 'O(1)' },
};
