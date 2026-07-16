// 协同调度 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sched-coscheduling',
  categoryId: 'scheduling',
  title: { zh: '协同调度 (Co-Scheduling)', en: 'Co-Scheduling' },
  summary: {
    zh: '把交互进程成组绑定到同一时间窗，减少同步等待。',
    en: 'Bind interacting processes into the same scheduling window to reduce sync latency.',
  },
  description: {
    zh: '协同调度是成组调度的广义形式：识别频繁交互的进程集合，把它们整体放入同一调度时段。比严格 gang 更宽松，允许部分抢占。',
    en: 'Co-scheduling generalizes gang scheduling: identify sets of interacting processes and place them together in the same scheduling window. Looser than strict gang, allowing partial preemption.',
  },
  tags: ['scheduling', 'coscheduling', 'synchronization'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
