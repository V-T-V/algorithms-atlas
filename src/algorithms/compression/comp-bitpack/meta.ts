// 位打包 Bit-Packing（Bit-Packing）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'comp-bitpack',
  categoryId: 'compression',
  title: { zh: '位打包 Bit-Packing', en: 'Bit-Packing' },
  summary: {
    zh: '按固定位宽将整数紧凑存入位流。',
    en: 'Pack integers into a bit stream at fixed width.',
  },
  description: {
    zh: '位打包将一组整数按 k 位宽度连续写入位缓冲，无对齐填充，常用于结构化小整数(如 5-bit 字母索引)。',
    en: 'Bit-packing writes integers of k-bit width consecutively into a bit buffer without alignment padding.',
  },
  tags: ['compression', 'bit-packing'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
