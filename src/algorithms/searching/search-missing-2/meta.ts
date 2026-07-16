// 查找缺失数字 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-missing-2',
  categoryId: 'searching',
  title: { zh: '查找缺失数字', en: 'Missing Number' },
  summary: {
    zh: '0..n 中缺失一个数，用求和公式减去实际和得到缺失值。',
    en: 'Of 0..n one number is missing; subtract the actual sum from the expected sum.',
  },
  description: {
    zh: '缺失数字：数组含 0..n 中的 n 个数（缺一个），找缺失值。用求和公式：期望和 = n(n+1)/2（n 为数组长度+1），实际和遍历累加，缺失 = 期望 - 实际。也可用异或（全部异或再异或 0..n）。时间 O(n)，空间 O(1)。LeetCode 268。',
    en: 'Missing number: the array holds n of the numbers 0..n (one missing); find it. Sum formula: expected = n(n+1)/2 (n = length+1), actual = sum of array, missing = expected - actual. XOR also works (XOR all, then XOR 0..n). Time O(n), space O(1). LeetCode 268.',
  },
  tags: ['searching', 'missing', 'sum', 'math'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
