import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-filling-bookcase',
  categoryId: 'dp',
  title: { zh: '填充书架', en: 'Filling Bookcase Shelves' },
  summary: {
    zh: '按顺序把书放上书架，每层限宽限高，最小化总高度。',
    en: 'Place books in order on shelves; each shelf has a width limit; minimize total height.',
  },
  description: {
    zh: 'LeetCode 1105。给定 books[i]=[thickness_i, height_i] 按顺序放置，书架宽度 shelfWidth。每层放若干本连续的书（厚度之和不超过 shelfWidth），该层高度取这些书的最大高度。求所有层高度之和的最小值。DP：dp[i] = 放完前 i 本书的最小总高度；dp[i]=min(dp[j] + max(height[j..i-1])) 对所有满足 sum(thickness[j..i-1])≤shelfWidth 的 j。时间 O(n²)，空间 O(n)。',
    en: 'LeetCode 1105. Place books in order on shelves of width shelfWidth; each shelf holds consecutive books within width, shelf height = max book height on it; minimize total height. dp[i]=min over j of dp[j]+max(height[j..i-1]) with sum(thickness[j..i-1])≤shelfWidth. Time O(n²), space O(n).',
  },
  tags: ['dp', 'leetcode'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
