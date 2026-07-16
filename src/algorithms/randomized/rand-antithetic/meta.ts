// 对偶变量法 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rand-antithetic',
  categoryId: 'randomized',
  title: { zh: '对偶变量法', en: 'Antithetic Variates' },
  summary: {
    zh: '成对使用 U 和 1-U 采样，利用负相关把估计方差降到原来的约 1/2。',
    en: 'Sample in pairs using U and 1-U; their negative correlation halves the estimator variance.',
  },
  description: {
    zh: '对偶变量法是蒙特卡洛方差缩减技术。对每个均匀随机数 U，同时使用其对偶 1-U 计算 f(U) 和 f(1-U)，取平均作为一次观测。当 f 单调时两者负相关，方差显著降低。常用于积分、金融期权定价。',
    en: 'Antithetic variates is a Monte Carlo variance-reduction technique. For each uniform draw U, also use its counterpart 1-U and average f(U) and f(1-U) as one observation. When f is monotone they are negatively correlated, cutting variance substantially. Used for integration and option pricing.',
  },
  tags: ['randomized', 'monte-carlo', 'variance-reduction', 'antithetic'],
  complexity: { time: 'O(N)', space: 'O(N)' },
};
