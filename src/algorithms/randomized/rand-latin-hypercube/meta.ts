// 拉丁超立方采样 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rand-latin-hypercube',
  categoryId: 'randomized',
  title: { zh: '拉丁超立方采样', en: 'Latin Hypercube Sampling' },
  summary: {
    zh: '把每维分成 n 段，保证每维每段恰好一个样本，k 维只需 n 个样本即可均匀覆盖。',
    en: 'Split each dimension into n bins ensuring exactly one sample per bin per dimension; n samples cover k dimensions uniformly.',
  },
  description: {
    zh: '拉丁超立方采样 (LHS, McKay 1979)：对 k 维每维把 [0,1] 分成 n 段，独立做 n 个置换（每段一采样点）。最终把 k 个置换按行配对成 n 个 k 维样本。优点是每维边缘分布均匀，比纯随机覆盖更好，常用于敏感性分析、计算机实验。',
    en: 'Latin Hypercube Sampling (LHS, McKay 1979): split each of k dimensions into n bins, independently permute the n bin-sampled points per dimension. Pair the k permutations row-wise into n k-dimensional samples. Each marginal is uniform; coverage beats plain random. Used in sensitivity analysis and computer experiments.',
  },
  tags: ['randomized', 'sampling', 'latin-hypercube', 'variance-reduction'],
  complexity: { time: 'O(k·n)', space: 'O(k·n)' },
};
