// 距离编码（Distance Coding）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'comp-distance-coding',
  categoryId: 'compression',
  title: { zh: '距离编码', en: 'Distance Coding' },
  summary: { zh: 'BWT 输出的高效整数编码。', en: 'Efficient integer coding for BWT output.' },
  description: {
    zh: '距离编码(Binder)为 BWT 输出设计：对每个符号记录到下一次出现相同符号的距离，常与游程/算术编码组合。',
    en: 'Distance coding (Binder) targets BWT output: for each symbol it stores the distance to its next occurrence, combined with run/arithmetic coding.',
  },
  tags: ['compression', 'bwt', 'distance-coding'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
