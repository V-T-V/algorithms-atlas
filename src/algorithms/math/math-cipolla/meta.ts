import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'math-cipolla',
  categoryId: 'math',
  title: { zh: 'Cipolla 算法', en: 'Cipolla Algorithm' },
  summary: {
    zh: '模素数 p 下求 sqrt(n)（Tonelli-Shanks 的另一实现）。',
    en: 'Compute square root of n modulo an odd prime p (Cipolla).',
  },
  description: {
    zh: '随机选取 a 使 a²-n 为二次非剩余，在二次扩域 F_p[ω] 上做 ω^p = n 的快速幂得到根。期望 O(log²p)。',
    en: 'Pick a with a²-n a non-residue; exponentiate ω^p in F_p[ω]. Expected O(log²p).',
  },
  tags: ['math', 'modular', 'number-theory', 'sqrt'],
  complexity: { time: 'O(log²p)', space: 'O(1)' },
};
