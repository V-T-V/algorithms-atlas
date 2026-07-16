// Bakery Algorithm (Lamport) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bakery-algorithm',
  categoryId: 'concurrency',
  title: { zh: '面包店算法', en: 'Bakery Algorithm' },
  summary: {
    zh: 'Lamport 面包店互斥：线程取号排队，号牌最小（号相同则 id 小）者进入临界区。',
    en: "Lamport's bakery mutual exclusion: threads take numbered tickets; the smallest (number, id) wins the critical section.",
  },
  description: {
    zh: '面包店算法（Lamport, 1974）是 n 线程互斥的经典算法，灵感来自面包店「取号排队」：\n\n- 每个线程在进入前先取一个号牌 `number[i] = max(number) + 1`（取号期间用 `choosing[i]` 防止读到半成品）。\n- 取号后，线程等待直到对所有其他线程 j 满足：`number[j]==0` 或 `(number[i], i) < (number[j], j)`（号牌字典序最小）。\n- 进入临界区后执行，退出时 `number[i] = 0`。\n\n号牌可能重复（并发取号读到同一 max），故用 `(number, id)` 字典序打破平局，保证唯一胜者，从而满足互斥。本实现以「请求序列」确定性模拟 lock/critical/unlock，便于录制与互斥性测试。',
    en: 'The bakery algorithm (Lamport, 1974) is a classic n-thread mutual exclusion scheme inspired by bakery ticket queues:\n\n- Before entering, each thread takes a ticket `number[i] = max(number) + 1` (guarded by `choosing[i]` to avoid torn reads).\n- It then waits until, for every other thread j: `number[j]==0` or `(number[i], i) < (number[j], j)` (lexicographically smallest ticket).\n- After its critical section it sets `number[i] = 0`.\n\nTickets may tie (concurrent reads of max), so the `(number, id)` lexicographic tie-break guarantees a unique winner, ensuring mutual exclusion. This implementation deterministically simulates lock/critical/unlock as a request sequence, for easy recording and mutual-exclusion testing.',
  },
  tags: ['concurrency', 'mutual-exclusion', 'lock-free', 'distributed'],
  complexity: { time: 'O(n) per lock', space: 'O(n)' },
  attributes: { model: '事件序列模拟 / event-sequence simulation' },
  references: [
    {
      label: "Lamport, L. (1974). A New Solution of Dijkstra's Concurrent Programming Problem.",
      url: 'https://lamport.org',
    },
  ],
};
