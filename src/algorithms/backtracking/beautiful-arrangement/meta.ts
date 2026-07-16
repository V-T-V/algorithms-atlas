// 优美排列（Beautiful Arrangement）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'beautiful-arrangement',
  categoryId: 'backtracking',
  title: { zh: '优美排列', en: 'Beautiful Arrangement' },
  summary: {
    zh: '统计 1..n 的优美排列数量（第 i 位能被 i 整除或反之）。',
    en: 'Count beautiful arrangements of 1..n (i divides value or value divides i).',
  },
  description: {
    zh: '假设有从 1 到 n 的 n 个整数。一个「优美排列」是指：把 1..n 排成一排后，对每个位置 i（1-based），arr[i] 能被 i 整除，或者 i 能被 arr[i] 整除。统计这样的排列总数。\n\n回溯思路：逐位置从 1 到 n，每个位置尝试放入一个尚未使用的数，若满足整除约束则继续。用 used 位掩码标记已用数。可以从后往前（先填后面的位置，约束更紧）来加速剪枝。',
    en: 'Suppose we have integers 1..n. A "beautiful arrangement" is a permutation where for every position i (1-based), arr[i] is divisible by i or i is divisible by arr[i]. Count such permutations.\n\nBacktracking: fill positions 1..n one by one, trying each unused number that satisfies the divisibility constraint, tracked by a used bitmask. Filling from the back (tighter constraints) prunes more aggressively.',
  },
  tags: ['backtracking', 'permutation', 'pruning'],
  complexity: { time: 'O(k)', space: 'O(n)' },
  references: [
    { label: 'LeetCode 526', url: 'https://leetcode.com/problems/beautiful-arrangement/' },
  ],
  defaultInput: 4,
};
