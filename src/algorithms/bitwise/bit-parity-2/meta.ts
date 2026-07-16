// 奇偶校验v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bit-parity-2',
  categoryId: 'bitwise',
  title: { zh: '奇偶校验v2', en: 'Parity v2' },
  summary: {
    zh: '基于 de Bruijn 查表判定 1 的个数奇偶。',
    en: 'Parity via byte-fold then de Bruijn lookup.',
  },
  description: {
    zh: '把 32 位折半异或到 4 位，查 16 项表得奇偶。返回 0(偶)/1(奇)。',
    en: 'XOR-fold to 4 bits then lookup 16-entry parity table. O(1).',
  },
  tags: ['bitwise', 'parity'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
