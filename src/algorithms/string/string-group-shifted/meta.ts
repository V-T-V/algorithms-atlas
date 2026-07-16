// 移位字符串分组 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'string-group-shifted',
  categoryId: 'string',
  title: { zh: '移位字符串分组（统一移位）', en: 'Group Shifted Strings' },
  summary: {
    zh: '把可经「统一字母移位」相互得到的字符串分到一组。',
    en: 'Group strings that can be transformed into each other by a uniform letter shift.',
  },
  description: {
    zh: '定义：若字符串 s 通过把每个字母统一向后移动 k 位（环绕 a-z）得到 t，则 s、t 同属一组。本实现为每个串生成「规范化签名」：相邻字符的字母差（mod 26）序列，签名相同者即同组。提供 shiftedKey、groupShifted 两个接口。零 DOM 依赖。',
    en: 'Definition: if string s can be transformed to t by shifting each letter uniformly by k positions (wrap around a-z), they belong to the same group. This computes a normalized signature: the sequence of adjacent letter differences (mod 26); identical signatures imply same group. Provides shiftedKey and groupShifted. Zero DOM dependency.',
  },
  tags: ['string', 'grouping', 'shift', 'cipher'],
  complexity: { time: 'O(N·k)', space: 'O(N·k)' },
};
