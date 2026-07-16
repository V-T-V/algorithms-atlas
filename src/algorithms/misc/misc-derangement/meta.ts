// 错排数（Derangement Number）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-derangement',
  categoryId: 'misc',
  title: { zh: '错排数', en: 'Derangement Number' },
  summary: {
    zh: '!n：n 个元素的排列中无一元素在原位的方案数，递推 !n=(n-1)(!(n-1)+!(n-2))。',
    en: '!n: permutations with no element in its original position; !(n)=(n-1)(!(n-1)+!(n-2)).',
  },
  description: {
    zh: '错排：D(n)=(n-1)(D(n-1)+D(n-2))，D(0)=1,D(1)=0。信封问题。',
    en: 'Derangement: D(n)=(n-1)(D(n-1)+D(n-2)), D(0)=1,D(1)=0. Hat-check problem.',
  },
  tags: ['misc', 'combinatorics'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
