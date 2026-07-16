// 可降键优先队列（索引二叉堆）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ds-priority-queue-decrease',
  categoryId: 'ds',
  title: {
    zh: '可降键优先队列（索引最小堆）',
    en: 'Indexed Min-Heap Priority Queue (Decrease-Key)',
  },
  summary: {
    zh: '带 decrease-key 的索引二叉最小堆，支持按 id O(log n) 修改优先级。',
    en: 'Indexed binary min-heap with decrease-key; O(log n) priority change by id.',
  },
  description: {
    zh: '在普通二叉堆基础上额外维护「id → 堆位置」的反向索引，从而支持 decreaseKey(id, newPrio)（把某 id 的优先级变小并上浮）。广泛用于 Dijkstra、Prim。本实现为最小堆，提供 push、pop、decreaseKey、getPrio、has 接口。区别于已有的 priority-queue（无 decrease-key）与 binary-heap-2。零 DOM 依赖。',
    en: 'On top of a binary heap we maintain a reverse index id→heap position, enabling decreaseKey(id, newPrio) (lower an id priority and sift up). Used in Dijkstra/Prim. Min-heap with push, pop, decreaseKey, getPrio, has. Distinct from the existing priority-queue (no decrease-key) and binary-heap-2. Zero DOM dependency.',
  },
  tags: ['ds', 'heap', 'priority-queue', 'decrease-key', 'indexed-heap'],
  complexity: { time: 'O(log n) per op', space: 'O(n)' },
};
