// SimHash 文档指纹 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sim-hash-impl',
  categoryId: 'hashing',
  title: { zh: 'SimHash 文档指纹', en: 'SimHash Document Fingerprint' },
  summary: {
    zh: '对每个特征哈希的每一位做 ± 加权累加，取符号得定长指纹；相似文档指纹相近。',
    en: 'Accumulate each feature hash bit with ± weight, take sign for a fixed-length fingerprint; similar docs stay close.',
  },
  description: {
    zh: 'SimHash 由 Moses Charikar（2002）提出，是一种局部敏感哈希（LSH），用于近似重复文档检测。流程：把文档拆成特征（如词或 n-gram）及权重；对每个特征计算一个 m 位哈希 h。维护一个长度 m 的整数累加器 V：对 h 的第 i 位，若为 1 则 V[i] += weight，若为 0 则 V[i] -= weight。所有特征累加完后，对每个 i 取符号：V[i] > 0 → 指纹第 i 位为 1，否则为 0。得到的 m 位二进制串即为文档指纹。关键性质：两文档越相似（共享特征越多），其指纹的汉明距离越小。检测近似重复时，只需比较指纹的汉明距离是否 ≤ 阈值。与 MinHash（面向 Jaccard）不同，SimHash 直接面向余弦相似度。配合分桶（如把指纹分段匹配），可在海量文档中以近线性时间找近重复。',
    en: 'SimHash, proposed by Moses Charikar (2002), is a locality-sensitive hash (LSH) used for near-duplicate document detection. Procedure: split a document into features (words or n-grams) with weights; hash each feature to an m-bit value h. Maintain an integer accumulator array V of length m: for bit i of h, add weight to V[i] if the bit is 1, subtract weight if it is 0. After all features, take the sign of each V[i]: fingerprint bit i is 1 if V[i] > 0, else 0. The resulting m-bit string is the document fingerprint. Key property: the more similar two documents are (more shared features), the smaller the Hamming distance of their fingerprints. To detect near-duplicates one only checks whether the Hamming distance is within a threshold. Unlike MinHash (which targets Jaccard), SimHash targets cosine similarity. Combined with bucketing (matching fingerprint segments), it finds near-duplicates in near-linear time over massive corpora.',
  },
  tags: ['hashing', 'locality-sensitive', 'near-duplicate', 'fingerprint'],
  complexity: { time: 'O(m·k)', space: 'O(m)' },
};
