// Lamport 面包店算法 n 线程 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'conc-bakery-n',
  categoryId: 'concurrency',
  title: { zh: 'Lamport 面包店算法（n 线程）', en: 'Lamport Bakery Algorithm (n threads)' },
  summary: {
    zh: '取号 + 排序：每个线程领号，号码最小且索引最小者先入临界区。',
    en: 'Take a ticket and line up: smallest (ticket, id) enters the critical section first.',
  },
  description: {
    zh: '面包店算法用两个数组 `choosing[i]` 和 `number[i]` 实现无原子指令的 n 线程互斥：\n\n1. choosing[i]=1\n2. number[i] = 1 + max(number)\n3. choosing[i]=0\n4. 对每个 j，等到 (choosing[j]=0) 且 (number[j]=0 或 (number[i],i) < (number[j],j))\n\n保证 FIFO 公平，无饥饿。',
    en: 'The bakery algorithm uses two arrays `choosing[i]` and `number[i]` for n-thread mutual exclusion without atomic instructions:\n\n1. choosing[i]=1\n2. number[i] = 1 + max(number)\n3. choosing[i]=0\n4. For each j, wait until (choosing[j]=0) and (number[j]=0 or (number[i],i) < (number[j],j))\n\nGuarantees FIFO fairness, no starvation.',
  },
  tags: ['concurrency', 'mutual-exclusion', 'bakery', 'fairness', 'lamport'],
  complexity: { time: 'O(n^2)', space: 'O(n)' },
};
