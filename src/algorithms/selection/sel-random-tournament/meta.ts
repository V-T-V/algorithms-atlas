// 随机锦标赛 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sel-random-tournament',
  categoryId: 'selection',
  title: { zh: '随机锦标赛', en: 'Random Tournament' },
  summary: {
    zh: '随机配对两两比较，胜者晋级，直到唯一冠军，近似中位选择。',
    en: 'Random pairwise matches with winners advancing until one champion; approximates median selection.',
  },
  description: {
    zh: '随机锦标赛：随机配对，每对胜者（值更大）晋级，败者淘汰，逐轮直到只剩一人。冠军是最大值；配合额外信息可估计排名。',
    en: 'Random tournament: pair elements randomly, the larger of each pair advances, losers are eliminated, round by round until one remains. The champion is the maximum; with extra bookkeeping it can estimate ranks.',
  },
  tags: ['selection', 'tournament', 'randomized'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
