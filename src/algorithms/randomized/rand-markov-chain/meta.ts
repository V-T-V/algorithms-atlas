// 马尔可夫链模拟 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rand-markov-chain',
  categoryId: 'randomized',
  title: { zh: '马尔可夫链模拟', en: 'Markov Chain Simulation' },
  summary: { zh: '模拟离散马尔可夫链。', en: 'Simulate a discrete Markov chain.' },
  description: { zh: '按转移矩阵随机选择下一状态。', en: 'Pick next state per transition matrix.' },
  tags: ['randomized', 'markov'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
