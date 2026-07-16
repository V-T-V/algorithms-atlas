import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-k-inverse-arrays',
  categoryId: 'dp',
  title: { zh: 'k 逆序对数组', en: 'K Inverse Pairs Array' },
  summary: {
    zh: '求 1..n 的排列中恰有 k 个逆序对的数目（取模）。',
    en: 'Count permutations of 1..n with exactly k inverse pairs (mod).',
  },
  description: {
    zh: '给定 n 和 k，求由 1..n 组成的、恰有 k 个逆序对的排列数目（对 1e9+7 取模）。状态 dp[m][j] = 1..m 的排列中恰有 j 个逆序对的数目。把 m 插入 1..m-1 的排列时，可产生 0..m-1 个新逆序对，故 dp[m][j] = Σ_{t=0..min(m-1,j)} dp[m-1][j-t]。用滑动窗口前缀和优化到 O(nk)。',
    en: 'Given n and k, count permutations of 1..n with exactly k inverse pairs (mod 1e9+7). State dp[m][j] = count for 1..m with j inverse pairs. Inserting m into a permutation of 1..m-1 adds 0..m-1 new inversions, so dp[m][j] = sum over t of dp[m-1][j-t]; a sliding-window prefix sum optimizes this to O(nk).',
  },
  tags: ['dp', 'counting', 'permutation', 'prefix-sum', 'modular', 'leetcode'],
  complexity: { time: 'O(nk)', space: 'O(k)' },
};
