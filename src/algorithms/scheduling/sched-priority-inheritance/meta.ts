// 优先级继承 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'sched-priority-inheritance',
  categoryId: 'scheduling',
  title: { zh: '优先级继承', en: 'Priority Inheritance' },
  summary: {
    zh: '低优先级持锁者临时继承等待者的高优先级。',
    en: 'Lock holder temporarily inherits waiter priority.',
  },
  description: {
    zh: '持锁者优先级 = max(自己, 等待者)。',
    en: 'Holder pri = max(self, waiters). O(n).',
  },
  tags: ['scheduling', 'priority', 'lock'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
