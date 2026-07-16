// 掩码求最大 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bit-max-2',
  categoryId: 'bitwise',
  title: { zh: '掩码求最大', en: 'Branchless Max' },
  summary: { zh: '用符号掩码无分支求两数最大值。', en: 'Branchless max via the sign mask.' },
  description: {
    zh: '对 a,b：diff = a - b；mask = diff >> 31（a<b 时全1）。max = a - (diff & mask)，即 a<b 时回退到 b。',
    en: 'diff = a-b; mask = diff>>31; max = a - (diff & mask). O(1).',
  },
  tags: ['bitwise', 'max', 'branchless'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
