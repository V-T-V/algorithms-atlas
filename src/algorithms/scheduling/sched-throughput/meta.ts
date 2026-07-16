// 吞吐量计算 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'sched-throughput',
  categoryId: 'scheduling',
  title: { zh: '吞吐量计算', en: 'Throughput Calculation' },
  summary: { zh: '单位时间完成的进程数。', en: 'Number of processes completed per unit time.' },
  description: { zh: '吞吐 = 进程数 / 总时间。', en: 'throughput = n / total. O(1).' },
  tags: ['scheduling', 'metric'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
