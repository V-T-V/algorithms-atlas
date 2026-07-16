// 字符串异位词判定 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'string-anagram',
  categoryId: 'string',
  title: { zh: '字符串异位词判定与分组', en: 'String Anagram Check and Grouping' },
  summary: {
    zh: '判定两串是否互为字母异位词，并支持把一批串按异位词分组。',
    en: 'Check whether two strings are anagrams and group a list of strings by anagram class.',
  },
  description: {
    zh: '异位词（anagram）：两串长度相同且所含字母（含重数）相同，只是顺序不同。判定方法：排序后比较，或用字符频次表（O(n)）。本实现同时提供频次法判定 isAnagram 与把一组字符串按「签名」分组 groupAnagrams（签名为排序后的串或频次编码）。零 DOM 依赖。',
    en: 'Anagram: two strings of equal length with identical multiset of characters. Detection via sorting or frequency table (O(n)). This provides both frequency-based isAnagram and groupAnagrams (keyed by sorted signature or frequency encoding). Zero DOM dependency.',
  },
  tags: ['string', 'anagram', 'frequency', 'grouping'],
  complexity: { time: 'O(n) check / O(N·k log k) group', space: 'O(Σ)' },
};
