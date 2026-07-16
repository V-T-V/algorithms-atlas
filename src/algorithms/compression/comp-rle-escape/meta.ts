// 转义 RLE（Escape RLE）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'comp-rle-escape',
  categoryId: 'compression',
  title: { zh: '转义 RLE', en: 'Escape RLE' },
  summary: { zh: '用转义符区分重复与字面字节。', en: 'Escape byte separates runs and literals.' },
  description: {
    zh: '转义 RLE 用一个特殊字节作为标记：后跟计数与字节表示连续重复，避免对不易压缩的数据产生膨胀。',
    en: 'Escape RLE uses a marker byte followed by count and value to encode runs, avoiding expansion on incompressible data.',
  },
  tags: ['compression', 'rle', 'escape'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
