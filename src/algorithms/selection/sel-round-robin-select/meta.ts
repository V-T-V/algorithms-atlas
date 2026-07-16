// 轮转选择 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sel-round-robin-select',
  categoryId: 'selection',
  title: { zh: '轮转选择', en: 'Round-Robin Selection' },
  summary: {
    zh: '按固定顺序循环挑选元素，公平分配，无饥饿。',
    en: 'Cycle through elements in fixed order for fair, starvation-free selection.',
  },
  description: {
    zh: '轮转选择维护一个游标，每次请求返回当前游标位置元素并前进一格（模 n）。常用于负载均衡、令牌调度，保证每个候选长期获得均等机会。',
    en: 'Round-robin selection keeps a cursor; each request returns the element at the cursor and advances (mod n). Used for load balancing and token scheduling, guaranteeing equal long-term opportunity for every candidate.',
  },
  tags: ['selection', 'round-robin', 'fair', 'scheduling'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
