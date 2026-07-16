// 抛硬币模拟 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rand-coin-flip',
  categoryId: 'randomized',
  title: { zh: '抛硬币模拟', en: 'Coin Flip Simulation' },
  summary: { zh: '模拟公平抛硬币。', en: 'Simulate a fair coin flip.' },
  description: { zh: '返回 0(反面)/1(正面)，p=0.5。', en: 'Returns 0/1 with p=0.5.' },
  tags: ['randomized', 'simulation'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
