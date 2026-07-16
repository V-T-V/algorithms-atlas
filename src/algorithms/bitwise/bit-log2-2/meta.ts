// 折半log2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bit-log2-2',
  categoryId: 'bitwise',
  title: { zh: '折半log2', en: 'Floor Log2 by Halving' },
  summary: { zh: '由 31-clz 得到 floor(log2(x))。', en: 'floor(log2(x)) = 31 - clz(x).' },
  description: {
    zh: '若 x>0，floor(log2 x) 即最高位 1 的位置。等价于 31 减去前导零个数。x=0 时返回 -1（未定义）。',
    en: 'For x>0, floor(log2 x) is the index of the MSB, i.e. 31 - clz(x). O(1).',
  },
  tags: ['bitwise', 'log2', 'clz'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
