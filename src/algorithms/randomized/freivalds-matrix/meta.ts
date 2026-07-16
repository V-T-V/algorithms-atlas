// Freivalds' Matrix Verification · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'freivalds-matrix',
  categoryId: 'randomized',
  title: { zh: 'Freivalds 矩阵乘法验证', en: "Freivalds' Matrix Product Verification" },
  summary: {
    zh: '随机化验证 A·B=C：取随机 0/1 向量 r，检查 A(Br)=Cr，单边错误概率 1/2。',
    en: 'Randomized check that A·B=C via a random 0/1 vector r: test A(Br)=Cr with one-sided error 1/2.',
  },
  description: {
    zh: 'Freivalds 算法（1977）用随机化在 O(n²) 时间内验证三个 n×n 矩阵是否满足 A·B=C（朴素乘法验证要 O(n³)）。做法：随机取一个分量仅 0/1 的向量 r，计算 Br、再算 A(Br) 与 Cr（都是矩阵-向量乘 O(n²)）。若 A·B=C 则必有 A(Br)=Cr；若 A·B≠C，令 D=A·B−C≠0，则 Dr 是随机向量在 D 的非零行上的加权和，恰为 0 的概率 ≤ 1/2（取每分量 0/1 独立时）。重复 k 次错误概率降到 2^(−k)。这是随机化算法节省确定时间下界的经典范例。',
    en: "Freivalds' algorithm (1977) uses randomization to verify in O(n²) time whether three n×n matrices satisfy A·B=C (naive multiplication check costs O(n³)). The method: draw a random 0/1 vector r, compute Br then A(Br) and Cr — all O(n²) matrix-vector products. If A·B=C then A(Br)=Cr holds; if A·B≠C, set D=A·B−C≠0, and Dr is a random weighted sum over D's non-zero rows that equals 0 with probability ≤ 1/2 (for independent 0/1 entries). Repeating k times drives the error down to 2^(−k). It is a classic example of randomization beating a deterministic lower bound.",
  },
  tags: ['randomized', 'matrix', 'verification', 'monte-carlo'],
  complexity: { time: 'O(k·n²)', space: 'O(n)' },
};
