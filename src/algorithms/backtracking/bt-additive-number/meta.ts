// 累加数 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-additive-number',
  categoryId: 'backtracking',
  title: { zh: '累加数', en: 'Additive Number' },
  summary: {
    zh: '回溯判断数字字符串能否拆成前两数之和等于后续的累加序列。',
    en: 'Backtracking to decide whether a digit string can split into an additive sequence (a+b=c).',
  },
  description: {
    zh: '枚举前两个数的长度，逐项验证后续是否满足 a[i]=a[i-1]+a[i-2]。数字不能有前导零。',
    en: 'Enumerate lengths of the first two numbers, then verify each subsequent term equals the sum of the previous two. No leading zeros allowed.',
  },
  tags: ['backtracking', 'string'],
  complexity: { time: 'O(n³)', space: 'O(n)' },
};
