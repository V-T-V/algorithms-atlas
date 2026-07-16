// 最大-最小公平分配（Max-Min Fairness）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'max-min-fairness',
  categoryId: 'scheduling',
  title: { zh: '最大-最小公平分配', en: 'Max-Min Fairness Allocation' },
  summary: {
    zh: '把固定总容量公平分给有上界需求的多方：让最小份额尽可能大。',
    en: 'Allocate fixed capacity to bounded-demand parties so the smallest share is as large as possible.',
  },
  description: {
    zh: '最大-最小公平（Max-Min Fairness, MMF）是网络带宽/资源分配的经典准则：给定总容量 C 与各方需求上界 dᵢ，分配 aᵢ 满足：\n- Σaᵢ = C（或 ≤ C）\n- 没有谁的份额能通过「从更宽裕者拿」而增大\n\n渐进式算法（progressive filling）：\n1. 把容量均分给所有未饱和方，每方得 C/n\n2. 若某方需求 dᵢ < C/n，则其只拿 dᵢ，剩余容量重新在未饱和方间再均分\n3. 重复直到所有方饱和或容量耗尽\n\n结果使「最小分配」最大化。',
    en: 'Max-Min Fairness (MMF) allocates fixed capacity C among parties with demands dᵢ so that no share can grow by taking from a less-fortunate party. Progressive filling: split C equally, cap any party at its demand, redistribute the surplus among unsaturated parties, repeat. Maximizes the minimum share.',
  },
  tags: ['scheduling', 'fairness', 'allocation', 'max-min'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
