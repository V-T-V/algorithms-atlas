// Rabin-Karp 滚动哈希匹配 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rabin-karp-rolling',
  categoryId: 'string',
  title: { zh: 'Rabin-Karp 滚动哈希匹配', en: 'Rabin-Karp Rolling Hash Matching' },
  summary: {
    zh: '用滚动哈希 O(n+m) 找子串，O(1) 滑动窗口更新哈希。',
    en: 'Use rolling hash to find substrings in O(n+m); O(1) sliding-window hash update.',
  },
  description: {
    zh: 'Rabin-Karp 用多项式滚动哈希 H(s[i..i+m-1]) = (H(s[i..i+m-2]) - s[i]·base^(m-1))·base + s[i+m-1] mod P，在 O(1) 内由前一个窗口的哈希得到后一个，从而 O(n+m) 扫描文本。命中时为避免哈希冲突需逐字符校验（或用双哈希）。本实现提供单哈希版（带冲突校验）与显式滚动更新接口，区别于已有的 rabin-karp（实现侧重不同）。零 DOM 依赖。',
    en: 'Rabin-Karp uses polynomial rolling hash H(s[i..i+m-1]) = (H(prev) - s[i]·base^(m-1))·base + s[i+m-1] mod P, updating in O(1) per window for O(n+m) scanning. Hits require character-wise verification to avoid collisions (or use double hashing). Provides single-hash with verification plus an explicit rolling-update interface. Zero DOM dependency.',
  },
  tags: ['string', 'rabin-karp', 'rolling-hash', 'pattern-matching'],
  complexity: { time: 'O(n+m) expected', space: 'O(1)' },
};
