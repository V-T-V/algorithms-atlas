// Base85/Ascii85（Ascii85）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'comp-base85',
  categoryId: 'compression',
  title: { zh: 'Base85/Ascii85', en: 'Ascii85' },
  summary: { zh: '5 字节编为 5 个 85 进制字符。', en: '5 bytes to 5 base-85 chars.' },
  description: {
    zh: 'Ascii85 把 4 字节(32 位)编为 5 个 85 进制字符，比 Base64 更紧凑，PDF/PostScript 使用。',
    en: 'Ascii85 encodes 4 bytes (32-bit) as 5 base-85 chars, denser than Base64; used in PDF/PostScript.',
  },
  tags: ['compression', 'base85', 'ascii85', 'encode'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
