// 数根 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'digit-root',
  categoryId: 'misc',
  title: { zh: '数根', en: 'Digital Root' },
  summary: {
    zh: '反复求各位和直到一位；公式 dr(n)=1+(n-1)%9。',
    en: 'Repeatedly sum digits until one digit; closed form dr(n)=1+(n-1)%9.',
  },
  description: {
    zh: '数根（digital root）：把一个数的各位数字相加，若结果仍有多位则重复，直到得到一位数。\n\n- 迭代法：每轮求各位和，直到 < 10\n- 公式法：dr(n) = 0 当 n=0；否则 1 + (n-1) mod 9\n\n数学依据：n 与其各位和模 9 同余。公式 O(1)，迭代 O(log n)。',
    en: 'Digital root: sum the digits of a number; if the result still has multiple digits, repeat, until one digit remains.\n\n- Iterative: sum digits each round until < 10\n- Closed form: dr(n) = 0 when n=0; otherwise 1 + (n-1) mod 9\n\nMath basis: n is congruent to its digit sum mod 9. Formula O(1), iterative O(log n).',
  },
  tags: ['number-theory', 'digit-manipulation'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
