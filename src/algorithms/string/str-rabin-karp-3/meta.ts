import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'str-rabin-karp-3',
  categoryId: 'string',
  title: { zh: 'Rabin-Karp（滚动哈希匹配）', en: 'Rabin-Karp (Rolling Hash Matching)' },
  summary: {
    zh: '用滚动哈希在 O(n+m) 平均时间内匹配，可推广到多模式。',
    en: 'Rolling hash achieves O(n+m) average matching; generalizes to multiple patterns.',
  },
  description: {
    zh: '维护当前窗口哈希值，O(1) 滚动更新；哈希相等时再逐字符确认避免碰撞。',
    en: 'Maintains a window hash updated in O(1); char-by-char check on hash equality avoids collisions.',
  },
  tags: ['string', 'rabin-karp', 'hash'],
  complexity: { time: 'O(n+m)', space: 'O(1)' },
};
