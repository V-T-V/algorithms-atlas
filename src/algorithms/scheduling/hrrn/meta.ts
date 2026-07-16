// Highest Response Ratio Next · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hrrn',
  categoryId: 'scheduling',
  title: { zh: '高响应比优先', en: 'Highest Response Ratio Next' },
  summary: {
    zh: '非抢占式调度：每次选响应比 (wait+burst)/burst 最高的作业，兼顾短作业与防饥饿。',
    en: 'Non-preemptive policy: pick the job with the highest response ratio (wait+burst)/burst, balancing short jobs and starvation avoidance.',
  },
  description: {
    zh: '高响应比优先（HRRN）是一种非抢占式 CPU 调度算法。每当 CPU 空闲时，它从已到达的作业中选择「响应比」最高者执行，响应比定义为：\n\nRR = (等待时间 + 执行时间) / 执行时间 = 1 + 等待时间 / 执行时间。\n\n短作业因 burst 小，初始 RR 就高（接近 1 但分母小），容易被选中；长作业随等待时间增长 RR 不断提高，最终一定会被选中，从而避免饥饿。HRRN 可看作 FCFS 与 SJF 的折中。注意 RR 是浮点比较，需注意精度。',
    en: 'Highest Response Ratio Next (HRRN) is a non-preemptive CPU scheduling algorithm. Whenever the CPU is free, it picks from arrived jobs the one with the highest "response ratio", defined as:\n\nRR = (waiting_time + burst) / burst = 1 + waiting_time / burst.\n\nShort jobs have a high initial RR (small denominator) and are favored; long jobs see their RR climb as they wait and are eventually picked, which prevents starvation. HRRN is a compromise between FCFS and SJF. Note RR comparisons are floating-point; beware precision.',
  },
  tags: ["scheduling"],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
