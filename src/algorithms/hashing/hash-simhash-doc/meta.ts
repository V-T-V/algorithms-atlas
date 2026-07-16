// SimHash 文档（SimHash Document）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-simhash-doc',
  categoryId: 'hashing',
  title: { zh: 'SimHash 文档', en: 'SimHash Document' },
  summary: {
    zh: '把文档特征加权求和后符号化，得到对局部修改鲁棒的指纹。',
    en: 'Weighted feature sum then sign-binarize; yields a fingerprint robust to local edits.',
  },
  description: {
    zh: 'SimHash：每特征哈希成 64 位，按权重累加每位的正负，最终每位取符号。汉明距离小=>文档相似。',
    en: 'SimHash: hash each feature to 64 bits, accumulate weighted +1/-1 per bit, sign each bit at end. Small Hamming distance => similar.',
  },
  tags: ['hashing', 'similarity', 'simhash'],
  complexity: { time: 'O(n)', space: 'O(64)' },
};
