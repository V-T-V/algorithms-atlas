// 发布订阅（Pub/Sub）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'design-pub-sub',
  categoryId: 'design',
  title: { zh: '发布订阅', en: 'Pub/Sub' },
  summary: {
    zh: '发布订阅：发布者与订阅者通过 topic 解耦。',
    en: 'Pub/Sub: decouple publishers and subscribers via topics.',
  },
  description: {
    zh: '发布订阅（Pub/Sub）发布者向 topic 发消息，不关心谁订阅；订阅者按 topic 收消息。中间通过 broker 分发。',
    en: 'Pub/Sub: publishers send messages to a topic without knowing subscribers; subscribers receive by topic; a broker dispatches.',
  },
  tags: ['design', 'pubsub', 'messaging', 'decoupling'],
  complexity: { time: 'O(s) per publish', space: 'O(s)' },
};
