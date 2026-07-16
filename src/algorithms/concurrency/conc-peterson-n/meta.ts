// Peterson n 线程推广 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'conc-peterson-n',
  categoryId: 'concurrency',
  title: { zh: 'Peterson 算法 n 线程推广', en: 'Peterson Algorithm (n-thread Tournament)' },
  summary: {
    zh: '用 n-1 个二元 Peterson 锁组成锦标赛树，实现 n 线程互斥。',
    en: 'A tournament tree of n-1 two-party Peterson locks yields n-thread mutual exclusion.',
  },
  description: {
    zh: '将两线程 Peterson 锁组织成一棵二叉树：n 个叶子为线程，内部节点是一场两方 Peterson 对决。线程从叶子向上，每层赢得对决者晋级，最终到达根者进入临界区。退出时按反序释放。\n\n叶子数需为 2 的幂；不足则填充 dummy。复杂度 O(log n) 每次进出。',
    en: 'Two-party Peterson locks are arranged as a binary tree: n leaves are threads, each internal node is a two-party Peterson duel. A thread climbs from leaf to root; the winner at each level advances, and whoever reaches the root enters the critical section. Exit releases in reverse order.\n\nLeaf count must be a power of two; pad with dummies if needed. O(log n) per entry/exit.',
  },
  tags: ['concurrency', 'mutual-exclusion', 'peterson', 'tournament-tree'],
  complexity: { time: 'O(log n)', space: 'O(n)' },
};
