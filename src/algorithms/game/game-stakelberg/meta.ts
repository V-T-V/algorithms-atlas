// 斯塔克伯格博弈（Stackelberg Leadership）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'game-stakelberg',
  categoryId: 'game',
  title: { zh: '斯塔克伯格博弈', en: 'Stackelberg Leadership' },
  summary: {
    zh: '领导先行选产量，跟随者反应，领导者获先发优势。',
    en: 'Leader moves first choosing quantity, follower reacts; leader gains first-mover advantage.',
  },
  description: {
    zh: '斯塔克伯格：领导者 q1，跟随者 q2=(a-c-b q1)/(2b)。领导者最优 q1=(a-c)/(2b)，利润高于古诺。',
    en: 'Stackelberg: leader q1, follower q2=(a-c-b q1)/(2b). Leader optimum q1=(a-c)/(2b), profit exceeds Cournot.',
  },
  tags: ['game', 'economics', 'sequential'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
