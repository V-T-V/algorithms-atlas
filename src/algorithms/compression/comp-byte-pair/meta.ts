// 字节对编码 BPE（Byte Pair Encoding）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'comp-byte-pair',
  categoryId: 'compression',
  title: { zh: '字节对编码 BPE', en: 'Byte Pair Encoding' },
  summary: { zh: '贪心合并最高频字节对为新符号。', en: 'Greedy merge of most frequent byte pair.' },
  description: {
    zh: 'BPE(Byte Pair Encoding)反复统计序列中出现最频繁的相邻字节对，用新符号替换，构建可用于压缩/分词的词汇表。',
    en: 'BPE repeatedly replaces the most frequent adjacent byte pair with a new symbol, building a vocabulary usable for compression or tokenization.',
  },
  tags: ['compression', 'bpe', 'byte-pair'],
  complexity: { time: 'O(n^2)', space: 'O(n)' },
};
