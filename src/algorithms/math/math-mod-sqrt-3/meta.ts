import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'math-mod-sqrt-3',
  categoryId: 'math',
  title: { zh: '模平方根（Tonelli-Shanks）', en: 'Modular Square Root (Tonelli-Shanks)' },
  summary: {
    zh: '求 x²≡n (mod p) 的解，p 为奇素数。',
    en: 'Solve x²≡n (mod p) for an odd prime p.',
  },
  description: {
    zh: 'Tonelli-Shanks：先判二次剩余（欧拉判据 n^((p-1)/2)≡1）。再用 p-1=Q·2^S 分解，找二次非剩余 z，迭代逼近解。',
    en: 'Tonelli-Shanks: Euler criterion first; then decompose p-1=Q·2^S, find quadratic non-residue z, iterate.',
  },
  tags: ['math', 'modular', 'sqrt', 'tonelli'],
  complexity: { time: 'O(log⁴ p)', space: 'O(1)' },
};
