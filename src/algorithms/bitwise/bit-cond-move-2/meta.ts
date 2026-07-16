// 条件选择 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bit-cond-move-2',
  categoryId: 'bitwise',
  title: { zh: '条件选择', en: 'Branchless Conditional Select' },
  summary: {
    zh: '无分支按 flag 选择 a 或 b：result = (flag ? a : b)。',
    en: 'Branchless select: choose a or b based on a boolean flag.',
  },
  description: {
    zh: 'mask = -flag（布尔转 0/-1），result = (a & mask) | (b & ~mask)。',
    en: 'mask = -(flag?1:0); result = (a & mask) | (b & ~mask). O(1).',
  },
  tags: ['bitwise', 'cmov', 'branchless'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
