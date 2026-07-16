// 算术编码 v3（Arithmetic Coding v3）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'comp-arithmetic-3',
  categoryId: 'compression',
  title: { zh: '算术编码 v3', en: 'Arithmetic Coding v3' },
  summary: {
    zh: '算术编码：用 [low, high) 区间表示整个消息，分数位编码。',
    en: 'Arithmetic coding: a [low, high) interval represents the whole message; fractional bits.',
  },
  description: {
    zh: '算术编码（Rissanen）用累积概率缩放 [low, high) 区间，最终输出一个分数。能逼近熵界，比 Huffman 更紧。',
    en: 'Arithmetic coding (Rissanen) scales [low, high) by cumulative probabilities and outputs a fraction, approaching the entropy bound tighter than Huffman.',
  },
  tags: ['compression', 'arithmetic', 'entropy', 'interval'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
