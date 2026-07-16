// Middle-Square Method · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'middle-square',
  categoryId: 'randomized',
  title: { zh: '平方取中法', en: 'Middle-Square Method' },
  summary: {
    zh: '冯·诺依曼 1949：把种子平方后取中间 n 位作为下一个伪随机数。',
    en: 'Von Neumann 1949: square the seed and take the middle n digits as the next pseudorandom number.',
  },
  description: {
    zh: '平方取中法（Middle-Square Method）由冯·诺依曼于 1949 年在 ENIAC 上用于随机数生成。算法极简：取一个 n 位（十进制）种子，平方后得到 2n 位数（不足前补 0），再取中间 n 位作为下一个数，循环往复。例如 4 位种子 1111：1111²=1234321，取中间 4 位 2343。优点是简单快速；致命缺陷是容易收敛到 0 或进入短周期（如 6100 → 2100 → 4100 → 8100 → 6100 循环），现代已不用，但作为伪随机数发生器的历史起点极具教学价值。',
    en: 'The Middle-Square Method was devised by John von Neumann in 1949 for random number generation on the ENIAC. The algorithm is extremely simple: take an n-digit (decimal) seed, square it to get a 2n-digit number (left-pad with zeros), then take the middle n digits as the next number, and repeat. For example, with a 4-digit seed 1111: 1111²=1234321, take the middle 4 digits 2343. Its advantage is simplicity and speed; its fatal flaw is that it readily converges to 0 or falls into short cycles (e.g. 6100 → 2100 → 4100 → 8100 → 6100), so it is obsolete today, but it remains valuable as the historical starting point of pseudorandom generators.',
  },
  tags: ['randomized', 'prng', 'number-theory', 'historical'],
  complexity: { time: 'O(1) per draw', space: 'O(1)' },
};
