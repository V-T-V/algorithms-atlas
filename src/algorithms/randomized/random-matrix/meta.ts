// 随机矩阵生成 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'random-matrix',
  categoryId: 'randomized',
  title: { zh: '随机矩阵生成', en: 'Random Matrix Generation' },
  summary: {
    zh: '按指定分布（均匀/伯努利/高斯）生成随机矩阵，用于指纹验证、随机投影、随机化算法。',
    en: 'Generate random matrices under given distributions (uniform / Bernoulli / Gaussian) for fingerprinting, random projection, and randomized algorithms.',
  },
  description: {
    zh: '随机矩阵是许多随机化算法的基本构件。本实现提供三种常见分布的矩阵生成：(1) **均匀 [a,b]**——每个元素独立取自 [a,b) 区间均匀分布，用于随机投影、模拟；(2) **伯努利 0/1**（Freivalds 风格）——每个元素以等概率取 0 或 1，用于矩阵乘法指纹验证、稀疏随机投影；(3) **高斯（Box-Muller）**——每个元素取自 N(μ,σ²)，用于 Johnson-Lindenstrauss 随机降维、降噪。所有生成都接受一个 [0,1) 随机源以便可复现。配套提供矩阵-向量乘、矩阵-矩阵乘、转置等基本运算。本演示还展示如何用随机矩阵快速验证 A·B=C（Freivalds 思路）。',
    en: 'Random matrices are the building blocks of many randomized algorithms. This implementation provides three common distributions: (1) **Uniform [a,b]** — each entry drawn independently from [a,b), used in random projection and simulation; (2) **Bernoulli 0/1** (Freivalds style) — each entry is 0 or 1 with equal probability, used in matrix-product fingerprinting and sparse random projection; (3) **Gaussian (Box-Muller)** — each entry from N(μ,σ²), used for Johnson-Lindenstrauss random dimensionality reduction and denoising. All generators accept a [0,1) random source for reproducibility. Basic operations such as matrix-vector product, matrix-matrix product, and transpose are included. The demo also shows how to quickly verify A·B=C using a random matrix (Freivalds idea).',
  },
  tags: ["randomized"],
  complexity: { time: 'O(mn)', space: 'O(mn)' },
};
