// 事件溯源 v2（Event Sourcing v2）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'design-event-sourcing-2',
  categoryId: 'design',
  title: { zh: '事件溯源 v2', en: 'Event Sourcing v2' },
  summary: {
    zh: '事件溯源：存事件序列，状态由重放得出。',
    en: 'Event sourcing: store an event log; state is derived by replay.',
  },
  description: {
    zh: '事件溯源（Event Sourcing）不存当前状态，而是存所有事件；状态 = reduce(初始, events)。支持时间旅行与审计。',
    en: 'Event Sourcing stores all events rather than current state; state = reduce(initial, events). Enables time travel and full audit.',
  },
  tags: ['design', 'event-sourcing', 'audit', 'fold'],
  complexity: { time: 'O(e)', space: 'O(e)' },
};
