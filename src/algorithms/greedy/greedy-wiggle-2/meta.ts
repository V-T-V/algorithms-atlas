// 摆动序列 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'greedy-wiggle-2',
  categoryId: 'greedy',
  title: { zh: '摆动序列', en: 'Wiggle Subsequence' },
  summary: {
    zh: '求最长摆动子序列（相邻差严格正负交替）；贪心数拐点。',
    en: 'Find the longest wiggle subsequence (strict alternating differences); greedily count turning points.',
  },
  description: {
    zh: 'LeetCode 376 摆动序列：相邻数差严格正负交替的最长子序列长度。贪心统计上升下降的拐点数。',
    en: 'LeetCode 376 Wiggle Subsequence: longest subsequence with strictly alternating positive/negative differences. Greedy counts turning points.',
  },
  tags: ['greedy', 'leetcode'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
