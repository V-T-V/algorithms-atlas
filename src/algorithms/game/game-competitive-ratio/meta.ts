// 竞争比分析（Competitive Ratio Analysis）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'game-competitive-ratio',
  categoryId: 'game',
  title: { zh: '竞争比分析', en: 'Competitive Ratio Analysis' },
  summary: {
    zh: '度量在线算法相对离线最优的性能，比值越小越优。',
    en: 'Measures online-algorithm performance vs offline optimum; smaller ratio is better.',
  },
  description: {
    zh: '竞争比 CR = 在线成本 / 离线最优成本。对一组实例计算最坏情况比值，评估在线策略质量。',
    en: 'Competitive ratio CR = online cost / offline optimal cost. Compute worst-case ratio over instances to grade the online strategy.',
  },
  tags: ['game', 'online-algorithm', 'analysis'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
