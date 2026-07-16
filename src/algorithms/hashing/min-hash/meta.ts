// MinHash · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'min-hash',
  categoryId: 'hashing',
  title: { zh: 'MinHash', en: 'MinHash' },
  summary: {
    zh: '用 k 个最小哈希签名估计 Jaccard 相似度 |A∩B| / |A∪B|。',
    en: 'Estimate Jaccard similarity |A∩B| / |A∪B| via k minimum-hash signatures.',
  },
  description: {
    zh: 'MinHash（Broder 1997）用一组随机哈希函数估计两个集合的 Jaccard 相似度 J=|A∩B|/|A∪B|。对集合 S 与 k 个独立哈希 h_1..h_k，签名 sig(S)[i] = min_{x∈S} h_i(x)。关键定理：Pr[sig(A)[i] = sig(B)[i]] = J。因此用签名中相等的位数比例即可无偏估计 J。签名为定长 k 的整数数组，可高效存储与比较，是大规模近似重复检测、文档去重、推荐召回（LSH）的核心组件。',
    en: 'MinHash (Broder 1997) uses a family of random hash functions to estimate the Jaccard similarity J=|A∩B|/|A∪B| of two sets. For set S and k independent hashes h_1..h_k, the signature is sig(S)[i] = min_{x∈S} h_i(x). Key fact: Pr[sig(A)[i] = sig(B)[i]] = J, so the fraction of matching signature components is an unbiased estimator of J. The signature is a fixed-length array of k integers, cheap to store and compare, and underpins large-scale near-duplicate detection, document deduplication, and recommender recall (LSH).',
  },
  tags: ['hashing', 'similarity', 'jaccard', 'lsh', 'probabilistic'],
  complexity: { time: 'O(k·|S|)', space: 'O(k)' },
};
