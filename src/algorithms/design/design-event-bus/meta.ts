// 事件总线（Event Bus）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'design-event-bus',
  categoryId: 'design',
  title: { zh: '事件总线', en: 'Event Bus' },
  summary: {
    zh: '事件总线：进程内同步事件分发。',
    en: 'Event bus: in-process synchronous event dispatch.',
  },
  description: {
    zh: '事件总线（Event Bus）是 pub/sub 的进程内同步实现，常用于组件间解耦通信。emit(event) 触发所有监听器。',
    en: 'Event Bus is an in-process synchronous pub/sub for decoupled component communication; emit(event) fires all listeners.',
  },
  tags: ['design', 'event-bus', 'in-process', 'dispatch'],
  complexity: { time: 'O(l) per emit', space: 'O(l)' },
};
