// 核心分配（Core Imputation）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'game-core-imputation',
  categoryId: 'game',
  title: { zh: '核心分配', en: 'Core Imputation' },
  summary: {
    zh: '合作博弈核心：任何联盟都不能通过单干获得更多，保证稳定性。',
    en: 'Core of a cooperative game: no coalition can do better alone, ensuring stability.',
  },
  description: {
    zh: '核心 = {x | Σx_i=v(N), Σ_{i∈S} x_i ≥ v(S) ∀S}。空核心意味着联盟不稳定。验证一组分配是否在核心。',
    en: 'Core = {x | Σx_i=v(N), Σ_{i∈S} x_i ≥ v(S) ∀S}. Empty core means instability. Verify whether an imputation lies in the core.',
  },
  tags: ['game', 'cooperative', 'stability'],
  complexity: { time: 'O(2ⁿ)', space: 'O(n)' },
};
