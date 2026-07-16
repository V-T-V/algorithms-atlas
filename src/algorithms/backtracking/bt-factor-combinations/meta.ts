// 因数组合 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-factor-combinations',
  categoryId: 'backtracking',
  title: { zh: '因数组合', en: 'Factor Combinations' },
  summary: {
    zh: '回溯列出 n 的所有因数乘积分解（不含 n 本身）。',
    en: 'Backtracking to list all factor-product decompositions of n (excluding n itself).',
  },
  description: {
    zh: '从最小因数 2 开始递归，维护一个 start 因数避免重复，把 n 分解为若干个 ≥2 因数的升序序列。',
    en: 'Recurse from factor 2 with a start lower-bound to avoid duplicates, decomposing n into ascending factors ≥2.',
  },
  tags: ['backtracking', 'number-theory'],
  complexity: { time: 'O(2^√n)', space: 'O(log n)' },
};
