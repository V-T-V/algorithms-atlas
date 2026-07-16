// 位平面分离（Bitplane Separation）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'comp-bitplane',
  categoryId: 'compression',
  title: { zh: '位平面分离', en: 'Bitplane Separation' },
  summary: { zh: '把每像素各位拆到独立平面。', en: 'Splits each pixel bit into planes.' },
  description: {
    zh: '位平面分离将图像每个像素的每一位分别放入独立平面，高位平面信息量大、低位近随机，可分别用 RLE/JPEG 编码。',
    en: 'Bitplane separation routes each pixel bit to its own plane; high planes carry signal, low planes look random, enabling per-plane coding.',
  },
  tags: ['compression', 'bitplane', 'image'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
