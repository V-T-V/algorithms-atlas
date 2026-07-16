// 向量时钟（因果排序）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'vector-clock',
  categoryId: 'concurrency',
  title: { zh: '向量时钟（因果排序）', en: 'Vector Clock (Causal Order)' },
  summary: {
    zh: '每个进程维护 n 维向量：本地事件自增本维，收消息逐维取 max，可判定并发关系。',
    en: 'Each process keeps an n-dim vector: increment own dim locally, take per-dim max on receive, to detect concurrency.',
  },
  description: {
    zh: '向量时钟（Mattern / Fidge 1988）用 n 维向量（n = 进程数）刻画事件的因果，可判定两个事件是否并发——这是 Lamport 标量时钟做不到的。\n\n规则（进程 p 的向量 V[p]）：\n- **本地事件**：V[p][p] += 1\n- **发送消息**：V[p][p] += 1，附带向量 V[p]\n- **接收消息**（带向量 m）：V[p][i] = max(V[p][i], m[i]) for all i；然后 V[p][p] += 1\n\n事件因果序：a →b 当且仅当 V(a) < V(b) 逐维严格小于。若 V(a) 与 V(b) 不可比较（各有大小），则 a、b 并发。\n\n本实现模拟多进程的 local/send/receive 事件并计算向量时钟，演示并发事件检测。',
    en: 'Vector clocks (Mattern / Fidge 1988) use an n-dim vector (n = number of processes) to capture causality, and can decide whether two events are concurrent — something Lamport scalar clocks cannot.\n\nRules (vector V[p] for process p):\n- **Local event**: V[p][p] += 1\n- **Send**: V[p][p] += 1, attach V[p]\n- **Receive** (with vector m): V[p][i] = max(V[p][i], m[i]) for all i; then V[p][p] += 1\n\nCausal order: a → b iff V(a) is strictly less than V(b) in every dimension. If V(a) and V(b) are incomparable (each has a larger dim), a and b are concurrent.\n\nThis implementation simulates local/send/receive events across processes and computes vector clocks, demonstrating concurrency detection.',
  },
  tags: ['concurrency', 'distributed', 'vector-clock', 'causality'],
  complexity: { time: 'O(n) per event', space: 'O(n²)' },
  attributes: { model: '事件序列模拟 / event-sequence simulation' },
};
