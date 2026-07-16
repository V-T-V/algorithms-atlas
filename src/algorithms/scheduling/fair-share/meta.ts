// 公平份额调度（Fair-Share）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'fair-share',
  categoryId: 'scheduling',
  title: { zh: '公平份额调度（Fair-Share）', en: 'Fair-Share Scheduling' },
  summary: {
    zh: '按用户/组分配 CPU 份额，避免某用户多进程独占。',
    en: 'Allocate CPU shares per user/group so one user with many processes cannot dominate.',
  },
  description: {
    zh: '传统调度按进程公平，导致一个用户开很多进程就能抢占 CPU。公平份额调度（FSS）按「用户/组」分配 CPU 份额：每个用户有一个权重（份额），CPU 时间按用户份额在用户间分配，再在用户内部按轮转分配。\n\n- 每个用户 ui 有份额 si\n- 用户 ui 内 k 个进程各应得 CPU = si / (Σs) / k\n- 调度时选「实际已用 / 应得比」最低的进程运行\n\n本实现用「累计 CPU 比率」做非抢占式时间片轮转模拟。',
    en: 'Per-process fairness lets one user run many processes to dominate. Fair-Share Scheduling (FSS) gives each user/group a share weight; CPU is divided among users by share, then split inside each user round-robin. The process with the lowest used/entitled ratio runs next. O(n^2 · T) where T is total time units.',
  },
  tags: ['scheduling', 'fair-share', 'group-fairness', 'round-robin'],
  complexity: { time: 'O(n^2 · T)', space: 'O(n)' },
};
