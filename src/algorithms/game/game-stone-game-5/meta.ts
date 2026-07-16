// 石子游戏 V · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-stone-game-5',
  categoryId: 'game',
  title: { zh: '石子游戏 V', en: 'Stone Game V' },
  summary: {
    zh: '区间 DP 求 Alice 每轮取较小一半能获得的最大分数。',
    en: 'Interval DP for the max score Alice earns by taking the smaller half each round.',
  },
  description: {
    zh: '把石子排成一行，每轮按某分割点分成左右两段，丢掉和较大的一段，得分加上较小段之和。求最大总得分。',
    en: 'Stones in a row; each round split at a point, discard the larger-sum half, gain the smaller sum. Find the maximum total score.',
  },
  tags: ['game', 'dp', 'interval'],
  complexity: { time: 'O(n²)', space: 'O(n²)' },
};
