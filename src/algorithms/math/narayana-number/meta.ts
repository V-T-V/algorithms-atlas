// Narayana 数 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'narayana-number',
  categoryId: 'math',
  title: { zh: 'Narayana 数', en: 'Narayana Number' },
  summary: {
    zh: 'N(n,k)=(1/n)C(n,k)C(n,k-1)，计数恰 k 个峰的 Dyck 路。',
    en: 'N(n,k)=(1/n)C(n,k)C(n,k-1) counts Dyck paths with exactly k peaks.',
  },
  description: {
    zh: 'Narayana 数 N(n,k) = (1/n)·C(n,k)·C(n,k-1)（1≤k≤n）计数恰有 k 个峰的 Dyck 路径数，也计数恰有 k 对配对括号嵌套结构。行和 Σ_k N(n,k) = C_n（第 n 个 Catalan 数）。本实现用 BigInt 精确计算（含 1/n 的整除性）。',
    en: 'The Narayana number N(n,k) = (1/n)·C(n,k)·C(n,k-1) (1≤k≤n) counts Dyck paths with exactly k peaks, and nested parenthesis structures with k pairs. The row sum Σ_k N(n,k) = C_n (the n-th Catalan number). Computed exactly with BigInt (the 1/n division is exact).',
  },
  tags: ['math', 'combinatorics', 'narayana', 'catalan'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
