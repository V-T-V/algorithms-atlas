// 欧拉数（排列）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'euler-number',
  categoryId: 'math',
  title: { zh: '欧拉数（排列，Eulerian）', en: 'Eulerian Number' },
  summary: {
    zh: '欧拉数 ⟨n,k⟩ 计数恰有 k 个上升的 n 元排列，递推 O(n²)。',
    en: 'Eulerian number ⟨n,k⟩ counts n-permutations with exactly k ascents; computed by O(n²) recurrence.',
  },
  description: {
    zh: '欧拉数 ⟨n,k⟩（Eulerian number）表示 n 个元素的排列中恰有 k 个「上升」（相邻 a_i < a_{i+1}）的个数。递推：⟨n,k⟩ = (k+1)·⟨n-1,k⟩ + (n−k)·⟨n-1,k−1⟩，边界 ⟨n,0⟩=1。本实现构造整张三角表。第 n 行之和为 n!。',
    en: 'The Eulerian number ⟨n,k⟩ counts permutations of n elements with exactly k ascents (adjacent positions with a_i < a_{i+1}). Recurrence: ⟨n,k⟩ = (k+1)·⟨n-1,k⟩ + (n−k)·⟨n-1,k−1⟩, with ⟨n,0⟩=1. This implementation builds the whole triangle. The row sum equals n!.',
  },
  tags: ['math', 'combinatorics', 'eulerian', 'permutation'],
  complexity: { time: 'O(n²)', space: 'O(n²)' },
};
