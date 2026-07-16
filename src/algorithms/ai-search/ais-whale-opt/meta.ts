// 鲸鱼优化（Whale Optimization Algorithm）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ais-whale-opt',
  categoryId: 'ai-search',
  title: { zh: '鲸鱼优化', en: 'Whale Optimization Algorithm' },
  summary: {
    zh: '模拟座头鲸气泡网捕食：收缩包围与螺旋更新切换。',
    en: 'Mimics humpback bubble-net feeding: shrink-encircling and spiral update switch.',
  },
  description: {
    zh: '鲸鱼优化算法（Mirjalili & Lewis 2016）：以 0.5 概率选收缩包围（朝最佳鲸靠近）或螺旋更新。|A|>1 时随机探索。本实现最小化 Sphere。',
    en: 'WOA (Mirjalili & Lewis 2016): with probability 0.5 use shrink-encircling (move toward best whale) or spiral update. When |A|>1 random exploration. Minimizes Sphere.',
  },
  tags: ['ai-search', 'swarm', 'optimization', 'woa'],
  complexity: { time: 'O(iter × whales × d)', space: 'O(whales × d)' },
};
