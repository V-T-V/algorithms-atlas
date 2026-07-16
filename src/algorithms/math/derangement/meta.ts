import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'derangement',
  categoryId: 'math',
  title: { zh: '错排数', en: 'Derangement' },
  summary: {
    zh: '全排列中无元素留在原位的数目，D(n)=(n-1)(D(n-1)+D(n-2))。',
    en: 'Number of permutations with no fixed points; D(n)=(n-1)(D(n-1)+D(n-2)).',
  },
  description: {
    zh: '错排数 D(n)（记作 !n）表示 n 个元素的排列中，每个元素都不在其原始位置上的排列数目。直观递推：考虑第 1 个元素放到位置 k（有 n-1 种选法），剩下两种情形——要么元素 k 放到位置 1（其余 n-2 个错排，D(n-2)），要么不放到位置 1（视作 n-1 个元素的错排，D(n-1)），因此 D(n) = (n-1)·(D(n-1)+D(n-2))，D(0)=1、D(1)=0。也等价于 D(n)=n!·Σ_{k=0}^{n}(-1)^k/k!（容斥原理）。时间 O(n)。',
    en: 'The derangement number D(n) (!n) counts permutations of n elements with no fixed point. Recurrence: place element 1 at position k (n-1 choices); then either element k goes to position 1 (a derangement of the remaining n-2, D(n-2)) or not (a derangement of n-1, D(n-1)), giving D(n) = (n-1)(D(n-1)+D(n-2)), with D(0)=1, D(1)=0. Equivalently D(n) = n!·Σ (-1)^k/k! (inclusion-exclusion). Time O(n).',
  },
  tags: ['math', 'combinatorics', 'derangement', 'recurrence'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
