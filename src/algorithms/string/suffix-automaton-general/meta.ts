// 广义后缀自动机（多串）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'suffix-automaton-general',
  categoryId: 'string',
  title: { zh: '广义后缀自动机（多串）', en: 'General Suffix Automaton (Multi-string)' },
  summary: {
    zh: '把多个串建到同一 SAM，支持判定子串是否出现在任一串中。',
    en: 'Build multiple strings into one SAM to test substring presence across any of them.',
  },
  description: {
    zh: '广义后缀自动机（GSAM）把多个串的所有子串压缩进一个 DAG。每插入一个新串前把 last 重置为根，并对已存在的转移做「克隆或复用」处理，保证状态数仍为线性。构建完成后：任一子串 t 是否在某个原串中出现 = 从根沿 t 的字符走转移是否能走通。本实现提供 addString 与 contains 两个核心方法。区别于已有的单串 SAM。',
    en: 'The general suffix automaton (GSAM) compresses all substrings of multiple strings into one DAG. Before inserting each new string reset last to root, and for existing transitions "clone or reuse" them to keep the state count linear. After construction: substring t appears in some original string iff the transitions from root along t succeed. Provides addString and contains. Distinct from the single-string SAM.',
  },
  tags: ['string', 'suffix-automaton', 'general', 'multi-string', 'substring'],
  complexity: { time: 'O(Σ|s|)', space: 'O(Σ|s|)' },
};
