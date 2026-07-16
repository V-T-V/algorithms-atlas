// Boyer-Moore 坏字符规则 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'boyer-moore-bad-char',
  categoryId: 'string',
  title: { zh: 'Boyer-Moore 坏字符规则匹配', en: 'Boyer-Moore Bad Character Rule' },
  summary: {
    zh: '用坏字符规则（bad-character shift table）做子串匹配，平均亚线性。',
    en: 'Substring matching using the bad-character shift table; average sublinear.',
  },
  description: {
    zh: 'Boyer-Moore 从模式串末尾向前比对，遇到不匹配的「坏字符」时，根据坏字符在模式中最后出现位置把模式整体右移，跳过大量不可能匹配的位置。本实现仅实现「坏字符」规则（简化版，不含好后缀规则），便于教学与可视化；在最坏情况下 O(n·m)，但在英文等小字母表实际场景中常优于 KMP。零 DOM 依赖。',
    en: 'Boyer-Moore scans the pattern right-to-left; on encountering a bad character it shifts the pattern by an amount derived from the last occurrence of that character in the pattern, skipping many impossible positions. This implements only the bad-character rule (simplified, no good-suffix rule) for teaching and visualization; worst case O(n·m) but typically beats KMP on small alphabets. Zero DOM dependency.',
  },
  tags: ['string', 'boyer-moore', 'pattern-matching', 'bad-character'],
  complexity: { time: 'O(n·m) worst / O(n/m) avg', space: 'O(Σ)' },
};
