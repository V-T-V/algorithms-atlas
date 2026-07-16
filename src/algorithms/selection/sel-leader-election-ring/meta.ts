// 环上选领导者 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sel-leader-election-ring',
  categoryId: 'selection',
  title: { zh: '环上领导者选举', en: 'Ring Leader Election' },
  summary: {
    zh: '单向环中进程传递选举消息，最大 id 者当选领导者。',
    en: 'In a unidirectional ring, processes pass an election message; the largest id becomes leader.',
  },
  description: {
    zh: 'Chang-Roberts 环算法（单向环）：某进程发起选举，把自身 id 沿环传递；每站若收到更大 id 则转发，更小则吞掉，等于自身则当选。最坏 O(n^2) 条消息。',
    en: 'Chang-Roberts ring algorithm (unidirectional): a process starts an election sending its id around the ring; each station forwards larger ids, swallows smaller ones, and wins when it receives its own id. Up to O(n^2) messages worst case.',
  },
  tags: ['selection', 'distributed', 'leader-election', 'ring'],
  complexity: { time: 'O(n^2)', space: 'O(n)' },
};
