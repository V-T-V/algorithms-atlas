// 位运算取绝对值 v2 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bitwise-abs-v2',
  categoryId: 'bitwise',
  title: { zh: '位运算取绝对值 v2 (算术右移)', en: 'Bitwise Absolute Value v2 (arithmetic shift)' },
  summary: {
    zh: '无分支实现二：用 (x ^ mask) - mask 配合算术右移。',
    en: 'Branchless variant two: (x ^ mask) - mask with arithmetic right shift.',
  },
  description: {
    zh: '这是位运算绝对值的另一等价写法，强调算术右移生成「全 1 或全 0」掩码：mask = x >> 31；结果 = (x ^ mask) - mask。与 v1 思路一致但展开顺序不同——v1 是 (x^mask) - mask，v2 显式拆成异或与减法两步演示，便于讲解。',
    en: 'Another equivalent branchless absolute value that emphasizes the arithmetic right shift producing an all-ones or all-zeros mask: mask = x >> 31; result = (x ^ mask) - mask. Same idea as v1 but unfolds the order to explicitly show XOR then subtract, useful for teaching.',
  },
  tags: ['bitwise', 'abs', 'branchless'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
