// 水仙花数判定 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'armstrong-number',
  categoryId: 'misc',
  title: { zh: '水仙花数（Armstrong 数）', en: 'Armstrong Number' },
  summary: {
    zh: '各位数字的 n 次方和等于自身的 n 位数。',
    en: 'An n-digit number equal to the sum of its digits each raised to the n-th power.',
  },
  description: {
    zh: '水仙花数（Armstrong / Narcissistic number）：一个 n 位十进制数，其各位数字的 n 次幂之和等于它本身。例如 153 = 1³+5³+3³，9474 = 9⁴+4⁴+7⁴+4⁴。\n\n判定步骤：\n1. 计算位数 n\n2. 逐位取数字 d，累加 d^n\n3. 比较累加和与原数\n\n三位的水仙花数：153、370、371、407。',
    en: 'An Armstrong (narcissistic) number is an n-digit decimal number equal to the sum of its digits each raised to the n-th power. E.g. 153 = 1³+5³+3³, 9474 = 9⁴+4⁴+7⁴+4⁴.\n\nSteps:\n1. Compute digit count n\n2. For each digit d accumulate d^n\n3. Compare the sum with the original number\n\nThree-digit Armstrong numbers: 153, 370, 371, 407.',
  },
  tags: ['number-theory', 'digit-manipulation'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
