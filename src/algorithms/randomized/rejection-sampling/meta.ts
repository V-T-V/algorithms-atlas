// Rejection Sampling · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rejection-sampling',
  categoryId: 'randomized',
  title: { zh: '拒绝采样', en: 'Rejection Sampling' },
  summary: {
    zh: '在包围分布中采样、按目标密度比例接受：通用非均匀采样法。',
    en: 'Sample from an enclosing proposal and accept proportional to the target density: a general non-uniform sampler.',
  },
  description: {
    zh: '拒绝采样（Rejection Sampling，冯·诺依曼）用一种易采样的「提议分布」g(x) 包住目标分布 f(x)（需满足 f(x) ≤ C·g(x)，C 为常数）。每次从 g 采一个候选 x，再掷一次均匀随机数 u ∈ [0, C·g(x)]，若 u ≤ f(x) 则接受 x，否则拒绝重来。直观上，接受概率正比于 f(x)/g(x)，故大量重复后接受的样本服从 f。它对任意已知密度比 f/g 的分布都适用，代价是拒绝会浪费样本（接受率 = 1/C）。本实现演示：用矩形包围框对任意离散密度函数采样。',
    en: 'Rejection Sampling (von Neumann) uses an easy-to-sample "proposal distribution" g(x) to enclose a target distribution f(x), requiring f(x) ≤ C·g(x) for some constant C. Each iteration samples a candidate x from g, then draws a uniform u ∈ [0, C·g(x)]; if u ≤ f(x) it accepts x, otherwise it rejects and retries. Intuitively the acceptance probability is proportional to f(x)/g(x), so accepted samples converge to f. It applies to any distribution whose density ratio f/g is known; the cost is wasted samples (acceptance rate = 1/C). This implementation demonstrates sampling an arbitrary discrete density using a rectangular bounding box.',
  },
  tags: ['randomized', 'sampling', 'monte-carlo', 'non-uniform'],
  complexity: { time: 'O(1/C) expected', space: 'O(1)' },
};
