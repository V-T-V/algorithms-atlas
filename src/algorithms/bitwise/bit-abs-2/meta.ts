// 掩码绝对值 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bit-abs-2',
  categoryId: 'bitwise',
  title: { zh: '掩码绝对值', en: 'Masked Absolute Value' },
  summary: {
    zh: '用算术右移生成全1/全0掩码无分支求绝对值。',
    en: 'Branchless abs via arithmetic-shift sign mask.',
  },
  description: {
    zh: '对 x：mask = x >> 31（算术右移，负数全1，非负全0），结果 = (x ^ mask) - mask。负数时翻转所有位再 +1 即 |x|。',
    en: 'mask = x >> 31 (all 1s if negative). abs = (x ^ mask) - mask. O(1).',
  },
  tags: ['bitwise', 'abs', 'branchless'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
