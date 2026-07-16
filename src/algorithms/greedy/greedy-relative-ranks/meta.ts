// 相对名次 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'greedy-relative-ranks',
  categoryId: 'greedy',
  title: { zh: '相对名次', en: 'Relative Ranks' },
  summary: {
    zh: '按分数降序给运动员排名，前三名冠/亚/季军。',
    en: 'Rank athletes by score descending; top three get medals.',
  },
  description: {
    zh: '对分数排序得到名次，前三名分别返回 "Gold"/"Silver"/"Bronze"，其余返回数字名次。',
    en: 'Sort scores to get ranks; top three return medal names, others return numeric rank strings.',
  },
  tags: ['greedy', 'sorting'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
