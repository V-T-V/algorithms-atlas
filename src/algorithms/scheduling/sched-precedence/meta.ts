// 优先约束调度 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'sched-precedence',
  categoryId: 'scheduling',
  title: { zh: '优先约束调度', en: 'Precedence Constraint Scheduling' },
  summary: {
    zh: '任务有先序约束，按拓扑序调度。',
    en: 'Schedule tasks with precedence via topological order.',
  },
  description: { zh: '拓扑排序后逐个执行。', en: 'Topo sort then execute. O(V+E).' },
  tags: ['scheduling', 'precedence', 'topological'],
  complexity: { time: 'O(V+E)', space: 'O(V)' },
};
