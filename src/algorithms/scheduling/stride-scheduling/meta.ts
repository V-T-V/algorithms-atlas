// 步幅调度（Stride Scheduling）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'stride-scheduling',
  categoryId: 'scheduling',
  title: { zh: '步幅调度', en: 'Stride Scheduling' },
  summary: {
    zh: '按权重反比分配：每进程有 stride=K/weight，每次选 passes 最小者运行并累加。',
    en: 'Distribute CPU inversely to weight: each task has stride=K/weight; always run the task with smallest passes and advance it.',
  },
  description: {
    zh: '步幅调度（Stride Scheduling，Waldspurger 1995）是一种确定性公平调度算法，能精确地按权重比例分配 CPU。\n\n核心机制：\n- 每个进程有一个**权重 weight**（决定应分到的 CPU 比例）。\n- 计算每个进程的**步幅 stride = K / weight**（K 是一个大常数，如所有权重之积或固定值）。权重越大，步幅越小。\n- 每个进程维护一个**累计值 passes**，初始为 0。\n- 调度器选择 **passes 最小** 的进程运行一个时间片，然后将其 passes += stride。\n- 重复。\n\n效果：长期看，每个进程被选中的次数严格正比于其权重（权重大的进程步幅小，passes 增长慢，被更频繁选中）。相比随机抽签（lottery scheduling），步幅调度是**确定性**的，短期分布更均匀。\n\n本实现支持任意权重，运行 N 步后统计每进程被选次数，验证比例近似 weight 比例。',
    en: "Stride Scheduling (Waldspurger, 1995) is a deterministic fair scheduling algorithm that distributes CPU in exact proportion to weights.\n\nCore mechanism:\n- Each task has a **weight** (its desired share).\n- Compute each task's **stride = K / weight** (K is a large constant, e.g. the product of all weights or a fixed value). Larger weight → smaller stride.\n- Each task maintains a cumulative **passes** counter, initially 0.\n- The scheduler runs the task with the **smallest passes** for one quantum, then adds its stride to its passes.\n- Repeat.\n\nEffect: over the long run each task is picked in strict proportion to its weight (high-weight tasks have small strides, slow passes growth, picked more often). Compared to randomized lottery scheduling, stride scheduling is **deterministic**, giving a more uniform short-term distribution.\n\nThis implementation supports arbitrary weights and after N steps verifies that pick counts approximate the weight ratios.: a scheduling algorithm.",
  },
  tags: ["scheduling"],
  complexity: { time: 'O(n·N)', space: 'O(n)' },
};
