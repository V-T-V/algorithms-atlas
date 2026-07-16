// 协调博弈 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-coordination',
  categoryId: 'game',
  title: { zh: '协调博弈', en: 'Coordination Game' },
  summary: {
    zh: '双方选同一行动都得正收益，有多个纯纳什。分析帕累托占优均衡。',
    en: 'Both gain by choosing the same action; multiple pure Nash. Identify the pareto-dominant equilibrium.',
  },
  description: {
    zh: '两个行动 A/B，都选 A 各得 2，都选 B 各得 1，不一致都得 0。两个纯纳什，A 是帕累托占优。',
    en: 'Actions A/B: both A → 2 each, both B → 1 each, mismatch → 0. Two pure Nash; A is pareto-dominant.',
  },
  tags: ['game', 'game-theory', 'matrix'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
