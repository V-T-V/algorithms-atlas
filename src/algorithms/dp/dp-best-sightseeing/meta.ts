import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-best-sightseeing',
  categoryId: 'dp',
  title: { zh: '最佳观光组合', en: 'Best Sightseeing Pair' },
  summary: {
    zh: 'scores[i]+scores[j]+i-j，求最大值（i<j）。',
    en: 'Maximize scores[i]+scores[j]+i-j with i<j.',
  },
  description: {
    zh: 'LeetCode 1014。景点评分 values，一对景点 (i,j)（i<j）的得分为 values[i]+values[j]+i-j。求最大得分。把它拆成 (values[i]+i) + (values[j]-j)。固定 j 时希望左侧 values[i]+i 最大；维护到 j-1 为止的 maxAi，则 ans=max(ans, maxAi + values[j]-j)，并更新 maxAi。时间 O(n)，空间 O(1)。',
    en: 'LeetCode 1014. Score of pair (i,j), i<j, is values[i]+values[j]+i-j. Split into (values[i]+i)+(values[j]-j). Track running max of (values[i]+i) up to j-1; ans=max(ans, maxAi+values[j]-j). Time O(n), space O(1).',
  },
  tags: ['dp', 'array', 'leetcode'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
