// 史密斯数（Smith Number）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-smith-number',
  categoryId: 'misc',
  title: { zh: '史密斯数', en: 'Smith Number' },
  summary: {
    zh: '合数其各位数字和等于其质因子各位数字和，如 22。',
    en: 'Composite whose digit sum equals the digit sum of its prime factors, e.g. 22.',
  },
  description: {
    zh: '史密斯数：合数 n，digitSum(n)=Σ digitSum(p_i^e_i)。例如 666=2·3·3·37，6+6+6=2+3+3+3+7=18。',
    en: 'Smith: composite n where digitSum(n)=Σ digitSum(prime factors). E.g. 666=2·3·3·37, sums both 18.',
  },
  tags: ['misc', 'number-theory'],
  complexity: { time: 'O(√n)', space: 'O(1)' },
};
