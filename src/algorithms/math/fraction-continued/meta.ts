// 连分数化简（小数→连分数）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'fraction-continued',
  categoryId: 'math',
  title: { zh: '连分数化简（小数→连分数）', en: 'Fraction Continued (Decimal to CF)' },
  summary: {
    zh: '把浮点小数逐位提取为连分数系数，并支持二次根式的周期连分数。',
    en: 'Extract a decimal into continued-fraction coefficients; supports periodic CF of quadratic surds.',
  },
  description: {
    zh: '连分数是实数的「最自然」展开：x = a_0 + 1/(a_1 + 1/(a_2 + ...))。本实现提供两条路径：(1) 小数（number）的有限连分数提取，用浮点迭代 a_k=⌊x⌋, x←1/(x−a_k)，直到余项为 0 或达到指定精度；(2) 二次根式 √D 的周期连分数，用整数 (m,d,a) 状态机展开直到检测到周期。区别于已有的 continued-fraction（分数 p/q → 系数），本算法处理小数与无理根式。',
    en: 'A continued fraction is the most natural expansion of a real: x = a_0 + 1/(a_1 + 1/(a_2 + ...)). This implementation offers two paths: (1) finite CF extraction from a decimal (number) by iterating a_k=⌊x⌋, x←1/(x−a_k) until the remainder is 0 or precision is exhausted; (2) the periodic CF of a quadratic surd √D via an integer (m,d,a) state machine run until a cycle is detected. Distinct from the existing continued-fraction (which converts p/q → coefficients) by handling decimals and irrational surds.',
  },
  tags: ['math', 'number-theory', 'continued-fraction', 'real'],
  complexity: { time: 'O(k)', space: 'O(k)' },
};
