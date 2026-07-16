// 相关均衡（Correlated Equilibrium）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'game-correlated-equilibrium',
  categoryId: 'game',
  title: { zh: '相关均衡', en: 'Correlated Equilibrium' },
  summary: {
    zh: '调解者发出相关信号，理性玩家不会偏离推荐策略。',
    en: 'A mediator sends correlated signals; rational players never deviate from the recommendation.',
  },
  description: {
    zh: "相关均衡：存在联合分布 π(a1..an) 使得对每个玩家 i 与每个推荐动作 ai，按 π 期望收益不低于改打任意 ai'。比纳什更宽松，可协调。",
    en: "Correlated equilibrium: a joint distribution π over actions such that for every player i and recommended action ai, the expected payoff under π is at least as high as deviating to any ai'. More general than Nash, allows coordination.",
  },
  tags: ['game', 'game-theory', 'equilibrium'],
  complexity: { time: 'O(n²)', space: 'O(n²)' },
};
