// 重构字符串（Reorganize String, LeetCode 767）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'reorganize-string',
  categoryId: 'greedy',
  title: { zh: '重构字符串', en: 'Reorganize String' },
  summary: {
    zh: '重排字符串使相邻字符都不相同（贪心 + 计数）。',
    en: 'Rearrange a string so no two neighbors are equal (greedy + count).',
  },
  description: {
    zh: '给定一个字符串 s，检查能否通过重排使任意两个相邻字符都不相同。若能则返回任一合法重排，否则返回空串。\n\n贪心：先统计每个字符的频次。若某字符频次 > ceil(n/2)（即 (n+1)/2）则不可能，返回空串。否则把字符按频次降序填入结果数组的偶数下标（0,2,4,...），填满后再填奇数下标。由于最高频字符不超过一半，偶数下标容得下它，从而相邻必不同。',
    en: "Given a string s, determine whether its characters can be rearranged so that no two adjacent characters are equal. If possible, return any valid rearrangement; otherwise return the empty string.\n\nGreedy: count each character's frequency. If any frequency exceeds ceil(n/2) (i.e. (n+1)/2), it is impossible — return empty. Otherwise sort characters by frequency descending and fill the result array at even indices (0,2,4,...) first, then odd indices. Since the most frequent character is at most half, even indices can hold it, guaranteeing different neighbors.",
  },
  tags: ['greedy', 'counting', 'string'],
  complexity: { time: 'O(n)', space: 'O(n)' },
  references: [{ label: 'LeetCode 767', url: 'https://leetcode.com/problems/reorganize-string/' }],
  defaultInput: 'aab',
};
