// 赌徒破产问题 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rand-gambler-ruin',
  categoryId: 'randomized',
  title: { zh: '赌徒破产问题', en: "Gambler's Ruin" },
  summary: { zh: '模拟赌徒破产过程。', en: "Simulate the gambler's ruin process." },
  description: {
    zh: '起始资本 i，目标 N，每步 ±1 等概率。',
    en: 'Start i, target N, ±1 each step with equal probability.',
  },
  tags: ['randomized', 'simulation'],
  complexity: { time: 'O(N)', space: 'O(1)' },
};
