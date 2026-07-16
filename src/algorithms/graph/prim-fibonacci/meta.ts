// Prim Fibonacci · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'prim-fibonacci',
  categoryId: 'graph',
  title: { zh: 'Prim·Fibonacci 堆', en: 'Prim (Fibonacci Heap)' },
  summary: {
    zh: 'Fibonacci 堆实现的 Prim 最小生成树。',
    en: 'Prim MST implemented with a Fibonacci heap.',
  },
  description: {
    zh: 'Fibonacci 堆支持 O(1) 摊还 insert / decrease-key 与 O(log n) 摊还 extract-min，使 Prim 算法达到 O(E + V log V)，在大规模稀疏图上优于二叉堆。本实现提供教学版 Fibonacci 堆（含 consolidate、cut、cascading-cut），并用其驱动 Prim。',
    en: 'A Fibonacci heap gives O(1) amortized insert / decrease-key and O(log n) amortized extract-min, yielding Prim in O(E + V log V), beating binary heaps on large sparse graphs. This teaching implementation includes consolidate, cut, and cascading-cut, and drives Prim.',
  },
  tags: ['graph', 'mst', 'prim', 'fibonacci-heap', 'priority-queue'],
  complexity: { time: 'O(E + V log V)', space: 'O(V+E)' },
};
