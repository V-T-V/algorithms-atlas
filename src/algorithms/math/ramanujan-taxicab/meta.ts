// Ramanujan Taxicab · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ramanujan-taxicab',
  categoryId: 'math',
  title: { zh: '拉马努金出租车数', en: 'Ramanujan Taxicab Number' },
  summary: {
    zh: '找能用两种方式写成两立方和的最小数。',
    en: 'Smallest number expressible as a sum of two cubes in two different ways.',
  },
  description: {
    zh: 'Hardy 说出租车号 1729「很无聊」，Ramanujan 立即指出它是「能用两种方式写成两个正立方数之和的最小数」：1729 = 1³+12³ = 9³+10³。Taxicab(n) 类：Ta(2)=1729。本实现枚举 a³+b³ (1<=a<b<=上限)，用哈希找出最早出现两种表示的数。时间 O(N² log)。',
    en: 'Hardy called cab 1729 dull; Ramanujan instantly noted it is the smallest number expressible as a sum of two positive cubes in two different ways: 1729 = 1³+12³ = 9³+10³. Taxicab class Ta(2)=1729. We enumerate a³+b³ for 1<=a<b<=limit and use a hash map to find the first number with two representations. Time O(N²).',
  },
  tags: ['math', 'number-theory', 'taxicab', 'ramanujan', 'cubes'],
  complexity: { time: 'O(N²)', space: 'O(N²)' },
};
