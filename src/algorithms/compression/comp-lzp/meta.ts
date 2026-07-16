// LZP 预测 LZ（LZP (Lempel-Ziv Prediction)）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'comp-lzp',
  categoryId: 'compression',
  title: { zh: 'LZP 预测 LZ', en: 'LZP (Lempel-Ziv Prediction)' },
  summary: {
    zh: '用上次出现上下文预测并编码偏移。',
    en: 'Predicts via prior context, encodes mismatches.',
  },
  description: {
    zh: 'LZP(Bloom)用前 k 字节的哈希作为上下文查表，若命中则只输出标志位与长度，否则输出字面，常作为高效预处理器。',
    en: 'LZP (Bloom) hashes the previous k bytes as context; on hit it emits a flag and length, otherwise a literal, serving as a fast preprocessor.',
  },
  tags: ['compression', 'lz', 'prediction'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
