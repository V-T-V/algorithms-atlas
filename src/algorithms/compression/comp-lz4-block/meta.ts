// LZ4 块格式（LZ4 Block Format）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'comp-lz4-block',
  categoryId: 'compression',
  title: { zh: 'LZ4 块格式', en: 'LZ4 Block Format' },
  summary: {
    zh: '极简 LZ4 块：token+literal+match。',
    en: 'Minimal LZ4 block: token+literal+match.',
  },
  description: {
    zh: 'LZ4 块格式以 1 字节 token 编码字面长度与匹配长度，后接字面字节与 (偏移,匹配)，速度优先，压缩比次要。',
    en: 'LZ4 block uses a 1-byte token encoding literal and match lengths followed by literals and (offset,match); prioritizes speed.',
  },
  tags: ['compression', 'lz4', 'block'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
