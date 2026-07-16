// 消耗战博弈 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-war-of-attrition',
  categoryId: 'game',
  title: { zh: '消耗战博弈', en: 'War of Attrition' },
  summary: {
    zh: '两玩家争资源持续到一方退出；坚持成本随时间线性增长。',
    en: 'Two players contest a resource until one quits; persistence cost grows with time.',
  },
  description: {
    zh: '消耗战（生物学经典）：每单位时间成本 1，胜者得资源价值 V，败者付出坚持到的时间。对称混合均衡：每个玩家以一定概率坚持到任意时间 t。',
    en: 'War of attrition (biology classic): per-unit-time cost 1, winner earns V, loser pays up to their persistence time. Symmetric mixed equilibrium exists.',
  },
  tags: ['game', 'game-theory', 'biology'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
