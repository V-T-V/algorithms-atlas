// 字符串最小字典序旋转（Booth 算法）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'string-min-lex-rotation',
  categoryId: 'string',
  title: {
    zh: '字符串最小字典序旋转（Booth 算法）',
    en: 'Lexicographically Minimal String Rotation (Booth)',
  },
  summary: {
    zh: 'Booth 算法 O(n) 求使 rotate(s,k) 字典序最小的旋转量 k。',
    en: 'Booth algorithm finds in O(n) the rotation offset k minimizing rotate(s,k) lexicographically.',
  },
  description: {
    zh: '求串 s 的所有循环旋转中字典序最小者。朴素法 O(n²)；Booth 算法在 s+s 上运行类似 KMP 的失败指针，维护候选起点 k，O(n) 完成求解。本实现返回最小旋转量与最小旋转串，区别于已有的 minimal-rotation（实现路径侧重不同）。零 DOM 依赖。',
    en: 'Find the lexicographically smallest among all cyclic rotations of s. Naive O(n²); Booth runs a KMP-like failure function on s+s maintaining candidate start k in O(n). Returns the offset and the minimal rotated string. Distinct implementation path from the existing minimal-rotation. Zero DOM dependency.',
  },
  tags: ['string', 'rotation', 'lexicographic', 'booth'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
