// 相邻对编码 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'comp-pairs',
  categoryId: 'compression',
  title: { zh: '相邻对编码', en: 'Byte-Pair Encoding' },
  summary: {
    zh: '迭代合并最高频相邻字节对为新符号，构建子词词表。',
    en: 'Iteratively merge the most frequent adjacent byte pair into a new symbol, building a subword vocabulary.',
  },
  description: {
    zh: '字节对编码（BPE）：\n\n- 初始每个字节是一个 token。\n- 反复统计相邻 token 对的频率，把最高频对合并成一个新 token。\n- 重复 N 轮，得到「合并规则表」+ 压缩后的 token 序列。\n- 解码按规则表反向展开。广泛用于 NLP 子词分词。',
    en: 'Byte-Pair Encoding (BPE):\n\n- Start with each byte as a token.\n- Repeatedly count adjacent token-pair frequencies and merge the top pair into a new token.\n- Repeat N rounds, yielding a merge table plus the compressed token sequence.\n- Decode reverses the merges. Widely used in NLP subword tokenization.',
  },
  tags: ['compression', 'dictionary', 'bpe'],
  complexity: { time: 'O(R·n)', space: 'O(V)' },
};
