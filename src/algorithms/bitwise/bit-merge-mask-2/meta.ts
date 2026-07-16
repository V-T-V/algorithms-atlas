// 掩码合并 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bit-merge-mask-2',
  categoryId: 'bitwise',
  title: { zh: '掩码合并', en: 'Merge by Mask' },
  summary: {
    zh: '按掩码合并：result = (a & m) | (b & ~m)，m 为1处取 a。',
    en: 'Merge two values: result = (a & m) | (b & ~m); takes a where mask is 1.',
  },
  description: {
    zh: '掩码 m 控制：m 的 1 位取自 a，0 位取自 b。常用于位域写入。',
    en: '(a & m) | (b & ~m). O(1).',
  },
  tags: ['bitwise', 'merge', 'bitfield'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
