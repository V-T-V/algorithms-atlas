// 递减数字分割串（Split String into Descending Numbers, LeetCode 842）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'split-string-desc',
  categoryId: 'greedy',
  title: { zh: '递减数字分割串', en: 'Split Array into Fibonacci Sequence' },
  summary: {
    zh: '把数字串拆成斐波那契式序列（每段 = 前两项之和），回溯求解。',
    en: 'Split a digit string into a Fibonacci-like sequence (each part = sum of two before), via backtracking.',
  },
  description: {
    zh: '给定一个只含数字的字符串 num，把它拆分成若干段，使每段对应一个非负整数，满足：从第三段起，每段都等于前两段之和（斐波那契式序列）。每段无前导零（除非该段就是 0 本身）。返回任一合法拆分（段数 >= 3）；不存在则返回空。\n\n本算法用回溯：依次尝试第一段、第二段的长度，然后贪心验证后续——一旦前两项确定，整个序列就唯一确定（下一项必须恰为前两项之和），直接生成并匹配字符串即可。这种「枚举前两项 + 贪心生成」避免了完全回溯，效率高。',
    en: 'Given a digit string num, split it into segments each being a non-negative integer, such that from the third segment onward each equals the sum of the two preceding ones (a Fibonacci-like sequence). No segment has leading zeros (unless it is 0 itself). Return any valid split (with >= 3 segments); return empty if none exists.\n\nThis algorithm uses backtracking: try lengths of the first and second segments, then greedily verify the rest — once the first two terms are fixed the whole sequence is uniquely determined (the next term must be exactly the sum of the two previous), so we generate and match the string directly. "Enumerate first two + greedy generation" avoids full backtracking and is efficient.',
  },
  tags: ['greedy', 'backtracking', 'string'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
  references: [
    {
      label: 'LeetCode 842',
      url: 'https://leetcode.com/problems/split-array-into-fibonacci-sequence/',
    },
  ],
  defaultInput: '11235813',
};
