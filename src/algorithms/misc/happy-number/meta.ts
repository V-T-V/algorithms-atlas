// Happy Number · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'happy-number',
  categoryId: 'misc',
  title: { zh: '快乐数', en: 'Happy Number' },
  summary: {
    zh: '反复对各位数字求平方和，最终能收敛到 1 的数为快乐数。',
    en: 'A happy number reaches 1 by repeatedly summing the squares of its digits.',
  },
  description: {
    zh: '从任意正整数出发，反复将其各位数字的平方求和替换。若该过程最终到达 1，则称其为「快乐数」；若陷入不含 1 的循环（最典型为 4→16→37→58→89→145→42→20→4），则不是快乐数。实现用 Set 检测环：一旦某次和重复出现，即可判定非快乐数并提前终止。',
    en: 'Starting from any positive integer, repeatedly replace it by the sum of the squares of its digits. If the process eventually reaches 1, the number is happy; if it falls into a cycle that does not contain 1 (the canonical cycle 4→16→37→58→89→145→42→20→4), it is unhappy. The implementation uses a Set to detect cycles, terminating as soon as a sum repeats.',
  },
  tags: ['misc', 'number-theory', 'cycle-detection', 'simulation'],
  complexity: { time: 'O(log n)', space: 'O(log n)' },
};
