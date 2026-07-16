// 优先级继承（Priority Inheritance Protocol）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'greedy-priority-inversion',
  categoryId: 'greedy',
  title: { zh: '优先级继承', en: 'Priority Inheritance Protocol' },
  summary: {
    zh: '低优先级任务持锁时临时继承最高等待者优先级，避免反转。',
    en: 'A low-priority task holding a lock inherits the highest waiter priority, avoiding inversion.',
  },
  description: {
    zh: '优先级继承：高优先级任务等待低任务持有的资源时，低任务临时升至高优先级尽快释放，防止中等任务抢占造成长延迟。',
    en: 'Priority inheritance: when a high task blocks on a resource held by a low task, the low task is boosted to release quickly.',
  },
  tags: ['greedy', 'scheduling', 'real-time'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
