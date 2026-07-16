// Base64 编码（Base64）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'comp-base64',
  categoryId: 'compression',
  title: { zh: 'Base64 编码', en: 'Base64' },
  summary: { zh: '6-bit 一组的二进制到文本编码。', en: '6-bit binary-to-text encoding.' },
  description: {
    zh: 'Base64 把每 3 字节编为 4 个 6-bit 字符(A-Z,a-z,0-9,+,/)，常用于在文本通道传输二进制数据。',
    en: 'Base64 encodes 3 bytes into 4 6-bit chars (A-Z,a-z,0-9,+,/), used to carry binary over text channels.',
  },
  tags: ['compression', 'base64', 'encode'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
