// 掷骰子模拟 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rand-dice-roll',
  categoryId: 'randomized',
  title: { zh: '掷骰子模拟', en: 'Dice Roll Simulation' },
  summary: { zh: '模拟掷骰子。', en: 'Simulate a dice roll.' },
  description: { zh: '返回 1..6 的均匀整数。', en: 'Uniform integer in 1..6.' },
  tags: ['randomized', 'simulation'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
