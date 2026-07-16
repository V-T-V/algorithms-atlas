// VByte 快速变长整数（VByte Fast Varint）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'comp-vbyte-fast',
  categoryId: 'compression',
  title: { zh: 'VByte 快速变长整数', en: 'VByte Fast Varint' },
  summary: { zh: '7 位一组+续接位的变长编码。', en: '7-bit chunks with continuation bit.' },
  description: {
    zh: 'VByte(Williams & Zobel)用每字节低 7 位存数据，最高位为续接标志，对小整数极度紧凑，倒排索引经典方案。',
    en: 'VByte uses 7 bits per byte with a high continuation flag, very compact for small ints; a classic inverted-index scheme.',
  },
  tags: ['compression', 'vbyte', 'varint'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
