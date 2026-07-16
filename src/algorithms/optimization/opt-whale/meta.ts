// 鲸鱼优化（Whale Optimization）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'opt-whale',
  categoryId: 'optimization',
  title: { zh: '鲸鱼优化', en: 'Whale Optimization' },
  summary: {
    zh: '模拟座头鲸气泡网捕食的包围与螺旋更新机制。',
    en: 'Mimics humpback whale bubble-net encircling and spiral updating.',
  },
  description: {
    zh: 'WOA：以 50% 概率选择缩小包围或螺旋更新，向最优鲸位置逼近。',
    en: 'WOA: 50% chance between shrinking encircle or spiral update toward best whale.',
  },
  tags: ['optimization', 'metaheuristic', 'swarm'],
  complexity: { time: 'O(k·n·d)', space: 'O(n·d)' },
};
