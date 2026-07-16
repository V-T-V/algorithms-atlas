// HyperLogLog · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hyperloglog',
  categoryId: 'hashing',
  title: { zh: 'HyperLogLog', en: 'HyperLogLog' },
  summary: {
    zh: '用 ~KB 级内存估计海量数据基数（不同元素个数），误差约 0.8%。',
    en: 'Estimate cardinality (distinct count) of massive streams with kilobytes of memory, ~0.8% error.',
  },
  description: {
    zh: 'HyperLogLog（Flajolet et al. 2007）用随机化哈希 + 概率计数估计集合的基数（不同元素个数），内存仅与精度相关（标准误差约 1.04/√m，m=2^b 为寄存器数）。核心思想：对每个元素计算 32/64 位哈希，取高 b 位选寄存器 j，剩余位的「前导零 + 1」记为 ρ；令 M[j]=max(M[j], ρ)。直觉是：观察到前导零越多，说明哈希越稀疏，基数越大。最终用调和平均合并所有寄存器，并做小/大基数修正，给出估计 n̂=α·m² / Σ 2^{-M[j]}。',
    en: "HyperLogLog (Flajolet et al. 2007) uses randomized hashing plus probabilistic counting to estimate a set's cardinality (number of distinct elements), with memory depending only on precision (standard error ≈ 1.04/√m, where m=2^b registers). Core idea: hash each element, use the top b bits to pick register j, and let ρ = (number of leading zeros in the rest) + 1; set M[j]=max(M[j], ρ). The intuition: more leading zeros observed implies a sparser hash space and thus a larger cardinality. Finally a harmonic mean combines all registers with small/large range corrections, giving n̂=α·m² / Σ 2^{-M[j]}.",
  },
  tags: ['hashing', 'cardinality', 'probabilistic', 'streaming'],
  complexity: { time: 'O(1) per element', space: 'O(2^b)' },
};
