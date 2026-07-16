// MinHash 集合（MinHash Set Similarity）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-minhash-set',
  categoryId: 'hashing',
  title: { zh: 'MinHash 集合', en: 'MinHash Set Similarity' },
  summary: {
    zh: '用 k 个哈希的最小值估计 Jaccard 相似度，用于近重复检测。',
    en: 'Use k min-hash values to estimate Jaccard similarity for near-duplicate detection.',
  },
  description: {
    zh: 'MinHash：对集合 S，h_min(S)=min_{x∈S} h(x)。P[h_min(A)=h_min(B)]=|A∩B|/|A∪B|。k 个哈希取平均降方差。',
    en: 'MinHash: for set S, h_min(S)=min h(x). P[h_min(A)=h_min(B)]=Jaccard(A,B). k hashes average to reduce variance.',
  },
  tags: ['hashing', 'similarity', 'minhash'],
  complexity: { time: 'O(k·|S|)', space: 'O(k)' },
};
