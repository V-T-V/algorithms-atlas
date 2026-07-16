// 低k位掩码 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bit-mask-shift-2',
  categoryId: 'bitwise',
  title: { zh: '低k位掩码', en: 'Low-k Bits Mask' },
  summary: {
    zh: '构造低 k 位全 1 的掩码：(1<<k) - 1。',
    en: 'Build a mask of k low set bits: (1<<k) - 1.',
  },
  description: {
    zh: '(1 << k) - 1 得到低 k 位全 1。k=0 → 0，k=32 需特殊处理。',
    en: '(1<<k) - 1 yields k low set bits. O(1).',
  },
  tags: ['bitwise', 'mask'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
