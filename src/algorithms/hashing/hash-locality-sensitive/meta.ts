// hash-locality-sensitive · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-locality-sensitive',
  categoryId: 'hashing',
  title: { zh: 'Locality-Sensitive Hash', en: 'Locality-Sensitive Hash' },
  summary: {
    zh: '局部敏感哈希（SimHash）：相似输入映射到相近哈希，用于近似最近邻与去重。',
    en: 'Locality-sensitive hash (SimHash): similar inputs map to similar hashes; used for ANN and dedup.',
  },
  description: {
    zh: '局部敏感哈希（Charikar SimHash）：\n\n- 对 d 维向量，每维乘以 +1/-1 随机投影。\n- 对每个投影方向累加符号，最后取符号位得到 d 位哈希。\n- 海明距离 ≈ 1 - cos 相似度。\n- Google 网页去重、Git patch 识别的核心。',
    en: 'Locality-sensitive hash (Charikar SimHash):\n\n- For a d-dim vector, multiply each dim by +1/-1 random projection.\n- Accumulate sign per projection axis, then take sign bit per axis to form a d-bit hash.\n- Hamming distance approximates 1 - cosine similarity.\n- Core of Google web dedup and Git patch identification.',
  },
  tags: ['hashing', 'lsh', 'simhash', 'nearest-neighbor'],
  complexity: { time: 'O(n*d)', space: 'O(d)' },
};
