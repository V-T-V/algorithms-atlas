// 二次剩余判定 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'quadratic-residue',
  categoryId: 'math',
  title: { zh: '二次剩余判定与枚举', en: 'Quadratic Residue Detection & Enumeration' },
  summary: {
    zh: '判定 a 是否为模 p 的二次剩余，并枚举 [1,p) 全部剩余。',
    en: 'Decide if a is a quadratic residue mod p and enumerate all residues in [1,p).',
  },
  description: {
    zh: '对奇素数 p，a 是模 p 的二次剩余当且仅当存在 x 使 x² ≡ a (mod p)。由欧拉判别法 a^((p-1)/2) ≡ 1 (mod p) 判定。本实现提供：(1) 单点判定 isQuadraticResidue(a,p)；(2) 枚举 [1,p) 的全部 (p-1)/2 个二次剩余（去重）。BigInt 实现。与 Legendre 符号算法互补——后者返回 ±1/0，本算法聚焦判定与枚举。',
    en: 'For odd prime p, a is a quadratic residue mod p iff some x satisfies x² ≡ a (mod p). Euler criterion a^((p-1)/2) ≡ 1 (mod p) decides it. This implementation provides: (1) point test isQuadraticResidue(a,p); (2) enumeration of all (p-1)/2 residues in [1,p) (deduplicated). BigInt-based. Complements the Legendre-symbol algorithm — which returns ±1/0 — by focusing on the decision and enumeration.',
  },
  tags: ['math', 'number-theory', 'quadratic-residue', 'enumeration'],
  complexity: { time: 'O(p) 枚举 / O(log p) 判定', space: 'O(p)' },
};
