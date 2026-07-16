// 对齐到2的幂 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bit-round-up-pow2-2',
  categoryId: 'bitwise',
  title: { zh: '对齐到2的幂', en: 'Align to Power of Two' },
  summary: {
    zh: '把 size 向上对齐到 align（2的幂）的倍数。',
    en: 'Round size up to a multiple of align (a power of two).',
  },
  description: {
    zh: '对齐公式：(size + align - 1) & ~(align - 1)，等价于向上取整到 align 的倍数。',
    en: '(size + align - 1) & ~(align - 1). O(1).',
  },
  tags: ['bitwise', 'alignment', 'power-of-two'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
