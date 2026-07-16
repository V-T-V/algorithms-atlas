// 最少水龙头 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'greedy-min-taps',
  categoryId: 'greedy',
  title: { zh: '最少水龙头浇灌', en: 'Minimum Number of Taps' },
  summary: {
    zh: '一维花园长 n，每个水龙头浇灌范围 [i−r, i+r]，求浇满整段的最少水龙头数。',
    en: 'A length-n garden; tap i covers [i−r, i+r]; find the minimum taps to water the whole strip.',
  },
  description: {
    zh: '把每个水龙头转成区间，贪心跳跃：在能到达范围内选能延伸最远的下一个水龙头。',
    en: 'Convert taps to intervals; greedily jump: within reach pick the tap extending farthest next.',
  },
  tags: ['greedy', 'jump-game', 'interval'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
