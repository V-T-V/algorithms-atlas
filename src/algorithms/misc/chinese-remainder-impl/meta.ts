// 中国剩余定理 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'chinese-remainder-impl',
  categoryId: 'misc',
  title: { zh: '中国剩余定理', en: 'Chinese Remainder Theorem' },
  summary: {
    zh: '求 x 使 x ≡ aᵢ (mod mᵢ)（mᵢ 两两互质），解在模 ∏mᵢ 下唯一。',
    en: 'Find x with x ≡ aᵢ (mod mᵢ) for pairwise-coprime mᵢ; solution is unique mod ∏mᵢ.',
  },
  description: {
    zh: '中国剩余定理（Chinese Remainder Theorem, CRT）源于《孙子算经》的「物不知数」问题：有物不知其数，三三数之剩二，五五数之剩三，七七数之剩二，问物几何？即求解同余方程组 x ≡ aᵢ (mod mᵢ)。当各模 mᵢ 两两互质时，方程组在模 M = ∏mᵢ 下有唯一解。构造方法：令 Mᵢ = M / mᵢ，求 Mᵢ 在模 mᵢ 下的逆元 tᵢ（Mᵢ·tᵢ ≡ 1 mod mᵢ，用扩展欧几里得），则 x = Σ aᵢ·Mᵢ·tᵢ (mod M)。CRT 是大整数表示（把一个大数拆成多个小模数下的余数，并行运算再合并）、RSA 解密优化、秘密共享的基础。本实现展示逐个模数合并（迭代式 CRT）的过程，并验证最终解满足所有同余。',
    en: 'The Chinese Remainder Theorem (CRT) originates from Sunzi Suanjing: "There are things whose number is unknown; counted by threes the remainder is 2, by fives it is 3, by sevens it is 2 — what is the count?" That is, solve the system x ≡ aᵢ (mod mᵢ). When the moduli mᵢ are pairwise coprime, the system has a unique solution modulo M = ∏mᵢ. Construction: let Mᵢ = M / mᵢ, compute the inverse tᵢ of Mᵢ modulo mᵢ (Mᵢ·tᵢ ≡ 1 mod mᵢ, via the extended Euclidean algorithm), then x = Σ aᵢ·Mᵢ·tᵢ (mod M). CRT underpins large-integer representation (splitting a big number into residues over small coprime moduli, computing in parallel, then recombining), RSA decryption optimisation, and secret sharing. This implementation visualises the iterative pairwise-merge CRT and verifies the final solution against all congruences.',
  },
  tags: ['misc', 'number-theory', 'modular-arithmetic', 'crt'],
  complexity: { time: 'O(k·log M)', space: 'O(1)' },
};
