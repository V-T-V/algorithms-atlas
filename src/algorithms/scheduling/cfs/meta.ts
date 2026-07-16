// 完全公平调度器（CFS）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'cfs',
  categoryId: 'scheduling',
  title: { zh: '完全公平调度器', en: 'Completely Fair Scheduler (CFS)' },
  summary: {
    zh: 'Linux CFS：按虚拟运行时间（vruntime）最小者调度，红黑树维护就绪队列。',
    en: 'Linux CFS: schedule the task with the smallest virtual runtime (vruntime); ready queue held in a red-black tree.',
  },
  description: {
    zh: '完全公平调度器（CFS）是 Linux 自 2.6.23 起的默认进程调度器，目标是在多任务间「公平」分配 CPU。\n\n核心概念 **vruntime（虚拟运行时间）**：\n- 每个进程维护一个 vruntime，初始为 0。\n- 进程运行时，vruntime 按 `实际运行时间 × (NICE_0_LOAD / 进程权重)` 累加。权重由 nice 值决定（nice 越低权重越大，vruntime 累加越慢，得到更多 CPU）。\n- CFS 始终选择就绪队列中 **vruntime 最小** 的进程运行。\n- 就绪队列用**红黑树**按 vruntime 排序，最左叶子即下一个要运行的进程，O(log n) 插入/删除。\n\n**时间片**：`target_latency / 进程数`（最小粒度 min_granularity 防止频繁切换）。\n\n效果：每个进程获得的 CPU 时间正比于其权重，长期看完全公平；短任务不会被饿死（vruntime 增长慢的优先）。本实现用排序数组模拟红黑树的最左查询。',
    en: 'The Completely Fair Scheduler (CFS) has been Linux\'s default process scheduler since 2.6.23, aiming to distribute CPU "fairly" among tasks.\n\nCore concept **vruntime (virtual runtime)**:\n- Each task maintains a vruntime, initially 0.\n- While running, vruntime accrues by `actual_runtime × (NICE_0_LOAD / task_weight)`. Weight comes from the nice value (lower nice → higher weight → slower vruntime growth → more CPU).\n- CFS always runs the ready task with the **smallest vruntime**.\n- The ready queue is a **red-black tree** keyed by vruntime; the leftmost leaf is the next task to run, with O(log n) insert/delete.\n\n**Time slice**: `target_latency / task_count` (a min_granularity floor prevents excessive switching).\n\nEffect: each task gets CPU proportional to its weight — completely fair in the long run; short tasks never starve (slow-growing vruntime runs first). This implementation uses a sorted array to emulate the leftmost lookup of the red-black tree.',
  },
  tags: ['scheduling', 'cfs', 'fair', 'vruntime', 'red-black-tree'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
