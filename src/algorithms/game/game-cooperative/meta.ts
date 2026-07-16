// 合作博弈 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-cooperative',
  categoryId: 'game',
  title: { zh: '合作博弈（Shapley 值）', en: 'Cooperative Game (Shapley Value)' },
  summary: {
    zh: '用 Shapley 值把联盟总收益公平分配给各参与者。',
    en: 'Distribute coalition payoff fairly among players using Shapley values.',
  },
  description: {
    zh: '给定每个联盟 S 的价值 v(S)，玩家 i 的 Shapley 值 = 对所有排列求边际贡献的平均。',
    en: "Given coalition values v(S), player i's Shapley value is the average marginal contribution over all orderings.",
  },
  tags: ['game', 'game-theory', 'cooperative'],
  complexity: { time: 'O(n!·n)', space: 'O(2^n)' },
};
