// 序贯概率比检验（Sequential Probability Ratio Test）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'game-sprt',
  categoryId: 'game',
  title: { zh: '序贯概率比检验', en: 'Sequential Probability Ratio Test' },
  summary: {
    zh: 'Wald SPRT：逐步抽样依似然比阈值判定假设，平均样本量最小。',
    en: 'Wald SPRT: sample sequentially, decide by likelihood-ratio bounds; minimizes expected sample size.',
  },
  description: {
    zh: 'SPRT 在 H0 vs H1 间决策。每步累积似然比 Λ，Λ<=A 接受 H0，Λ>=B 接受 H1。A=β/(1-α)，B=(1-β)/α。',
    en: 'SPRT decides between H0 and H1. Accumulate likelihood ratio Λ; Λ<=A accept H0, Λ>=B accept H1. A=β/(1-α), B=(1-β)/α.',
  },
  tags: ['game', 'sequential-analysis', 'decision'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
