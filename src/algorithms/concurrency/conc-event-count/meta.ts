// 事件计数器（Event Count）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'conc-event-count',
  categoryId: 'concurrency',
  title: { zh: '事件计数器', en: 'Event Count' },
  summary: {
    zh: 'EventCount：单调递增事件序号，await(ticket) 等到事件到达。',
    en: 'EventCount: monotonically increasing event number; await(ticket) blocks until reached.',
  },
  description: {
    zh: '事件计数器（Reppert）维护单调递增的 count；advance() 使 count+1 并唤醒所有等待 count 的线程；await(ticket) 阻塞到 count >= ticket。用于等序号同步。',
    en: 'Event Count (Reppert) keeps a monotonically increasing count; advance() increments and wakes waiters; await(ticket) blocks until count >= ticket. Used for sequence-number synchronization.',
  },
  tags: ['concurrency', 'synchronization', 'event-count', 'await'],
  complexity: { time: 'O(1)', space: 'O(n)' },
};
