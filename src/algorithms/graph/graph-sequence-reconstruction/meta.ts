import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-sequence-reconstruction',
  categoryId: 'graph',
  title: { zh: '序列重建', en: 'Sequence Reconstruction' },
  summary: {
    zh: '判断 org 是否为给定子序列唯一可重建的超序列。',
    en: 'Check if org is the unique reconstruction from given subsequences.',
  },
  description: {
    zh: 'LeetCode 444。给定原始序列 org（1..n 的排列）和一组子序列 seqs，判断能否由 seqs 中的偏序关系唯一重建出 org。把相邻元素对当作边建图，做拓扑排序：拓扑序必须唯一且等于 org。每步队列长度必须恒为 1，最终序 == org。时间 O(V+E)，空间 O(V+E)。',
    en: 'LeetCode 444. Given org (a permutation of 1..n) and subsequences seqs, decide if org is the unique topological reconstruction. Build edges from adjacent pairs in seqs; topological order must be unique (queue length always 1) and equal org. Time O(V+E), space O(V+E).',
  },
  tags: ['topological-sort', 'graph', 'leetcode'],
  complexity: { time: 'O(V+E)', space: 'O(V+E)' },
};
