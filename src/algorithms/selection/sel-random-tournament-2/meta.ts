// 随机锦标赛 v2（Random Tournament Select v2）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sel-random-tournament-2',
  categoryId: 'selection',
  title: { zh: '随机锦标赛 v2', en: 'Random Tournament Select v2' },
  summary: {
    zh: '随机化锦标赛：随机配对淘汰，期望 O(n) 选最小。',
    en: 'Randomized tournament: random pairing elimination; expected O(n) for minimum.',
  },
  description: {
    zh: '随机锦标赛：每轮随机配对淘汰较大者，重复 k 轮得第 k 小。',
    en: 'Random tournament: each round randomly pairs and eliminates the larger; repeat k rounds for the k-th smallest.',
  },
  tags: ['selection', 'tournament', 'randomized'],
  complexity: { time: 'O(kn)', space: 'O(n)' },
};
