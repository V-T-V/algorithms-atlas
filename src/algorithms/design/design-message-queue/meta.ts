// 消息队列（Message Queue）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'design-message-queue',
  categoryId: 'design',
  title: { zh: '消息队列', en: 'Message Queue' },
  summary: {
    zh: '消息队列：FIFO 缓冲，生产/消费解耦。',
    en: 'Message queue: FIFO buffer decoupling producers and consumers.',
  },
  description: {
    zh: '消息队列（MQ）按 FIFO 顺序缓冲消息：生产者 enqueue，消费者 dequeue。削峰填谷、异步解耦的核心结构。',
    en: 'Message Queue buffers messages FIFO: producers enqueue, consumers dequeue; core structure for peak-shaving and async decoupling.',
  },
  tags: ['design', 'queue', 'async', 'buffer'],
  complexity: { time: 'O(1) per op', space: 'O(n)' },
};
