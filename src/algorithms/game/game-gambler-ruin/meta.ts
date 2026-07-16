// 赌徒破产问题（Gambler Ruin）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'game-gambler-ruin',
  categoryId: 'game',
  title: { zh: '赌徒破产问题', en: 'Gambler Ruin' },
  summary: {
    zh: '公平/有偏随机游走：求到达 N 前先破产 0 的概率。',
    en: 'Random walk with absorbing barriers 0 and N; probability of ruin before reaching N.',
  },
  description: {
    zh: '赌徒破产：本金 i，目标 N，每步以 p 赢 1。p=0.5 时 P(破产)=(N-i)/N；p≠0.5 时=(r^N-r^i)/(r^N-1)，r=q/p。',
    en: 'Gambler ruin: capital i, goal N, win prob p each step. Fair: P(ruin)=(N-i)/N; biased r=q/p: (r^N-r^i)/(r^N-1).',
  },
  tags: ['game', 'random-walk', 'probability'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
