// StreamVByte（StreamVByte）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'comp-streamvbyte',
  categoryId: 'compression',
  title: { zh: 'StreamVByte', en: 'StreamVByte' },
  summary: { zh: '长度与数据分离的 varint。', en: 'Length/data-separated varint.' },
  description: {
    zh: 'StreamVByte(Stefanov)把每个整数的字节长度集中存到控制流，数据流只含数值字节，SIMD 友好、解码极快。',
    en: 'StreamVByte stores per-int byte lengths in a control stream and raw bytes separately, enabling SIMD-friendly fast decoding.',
  },
  tags: ['compression', 'varint', 'streamvbyte'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
