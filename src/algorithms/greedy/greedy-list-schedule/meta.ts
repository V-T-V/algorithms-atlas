// 列表调度（List Scheduling）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'greedy-list-schedule',
  categoryId: 'greedy',
  title: { zh: '列表调度', en: 'List Scheduling' },
  summary: {
    zh: '按优先级列表把就绪任务贪心分配到空闲机器，经典并行调度。',
    en: 'Assign ready tasks to idle machines by a priority list; classic parallel scheduling.',
  },
  description: {
    zh: '列表调度：任务有优先级（如关键路径长度），扫描就绪集，按优先序分配到可用机器。Graham 调度基础。',
    en: 'List scheduling: tasks have priorities (e.g. critical-path length); scan ready set in priority order to free machines. Graham basis.',
  },
  tags: ['greedy', 'scheduling', 'dag'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
