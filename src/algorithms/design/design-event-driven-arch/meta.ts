// 事件驱动架构（Event-Driven Architecture）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'design-event-driven-arch',
  categoryId: 'design',
  title: { zh: '事件驱动架构', en: 'Event-Driven Architecture' },
  summary: { zh: '生产者发事件、消费者响应。', en: 'Producers emit events; consumers react.' },
  description: {
    zh: '事件驱动架构以事件为通信媒介：生产者发事件到总线/主题，消费者异步订阅响应，组件高度解耦、易扩展。',
    en: 'Event-Driven Architecture uses events as the communication medium: producers emit to a bus/topic, consumers subscribe and react asynchronously; highly decoupled and extensible.',
  },
  tags: ['design', 'pattern', 'event-driven', 'architectural'],
  complexity: { time: 'O(e*c)', space: 'O(s)' },
};
