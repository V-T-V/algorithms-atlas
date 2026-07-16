// Legendre 符号 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'legendre-symbol',
  categoryId: 'math',
  title: { zh: 'Legendre 符号', en: 'Legendre Symbol' },
  summary: {
    zh: '对奇素数 p 计算 (a|p)=a^((p-1)/2) mod p，判定二次剩余。',
    en: 'Compute the Legendre symbol (a|p)=a^((p-1)/2) mod p for odd prime p to test quadratic residuosity.',
  },
  description: {
    zh: 'Legendre 符号 (a|p)（p 为奇素数）取值 {-1, 0, 1}：0 表示 p|a；1 表示 a 是模 p 的二次剩余；-1 表示非剩余。由欧拉判别法 (a|p) ≡ a^((p-1)/2) (mod p)。BigInt 模幂实现。可用于判断是否存在 x 使 x² ≡ a (mod p)。',
    en: 'The Legendre symbol (a|p) for odd prime p takes values {-1, 0, 1}: 0 if p|a; 1 if a is a quadratic residue mod p; -1 if a non-residue. By Euler criterion (a|p) ≡ a^((p-1)/2) (mod p). Implemented with BigInt modular exponentiation. Indicates whether some x satisfies x² ≡ a (mod p).',
  },
  tags: ['math', 'number-theory', 'legendre', 'quadratic-residue'],
  complexity: { time: 'O(log p)', space: 'O(1)' },
};
