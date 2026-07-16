// 并行蒙特卡洛 Pi · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'conc-monte-carlo-pi-concurrent',
  categoryId: 'concurrency',
  title: { zh: '并行蒙特卡洛 Pi', en: 'Parallel Monte Carlo Pi' },
  summary: {
    zh: '多工作线程各投点统计，归约（reduce）命中数后估算 Pi。',
    en: 'Multiple workers each throw points; a reduce sums hits to estimate Pi.',
  },
  description: {
    zh: '并行蒙特卡洛：将 N 次投点划分给 W 个工作线程，各统计落入单位圆内的点数；主线程 reduce 求和后 π ≈ 4 * 总命中 / N。这是 MapReduce 思想的典型示例。',
    en: 'Parallel Monte Carlo: split N throws across W workers, each counting points inside the unit circle; the main thread reduces the sum and estimates π ≈ 4 * totalHits / N. A canonical MapReduce example.',
  },
  tags: ['concurrency', 'monte-carlo', 'parallel', 'map-reduce'],
  complexity: { time: 'O(N/W)', space: 'O(W)' },
};
