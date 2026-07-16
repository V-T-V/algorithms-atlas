// tANS（tANS）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'comp-tans',
  categoryId: 'compression',
  title: { zh: 'tANS', en: 'tANS' },
  summary: {
    zh: 'tANS：表驱动 ANS，FSE 的基础。',
    en: 'tANS: table-driven ANS, the basis of FSE.',
  },
  description: {
    zh: 'tANS（table ANS）预算好「状态-符号」转移表，编/解码都是查表，速度快于 rANS。',
    en: 'tANS (table ANS) precomputes state-symbol transition tables so encode/decode are table lookups; faster than rANS.',
  },
  tags: ['compression', 'ans', 'entropy', 'tans', 'fse'],
  complexity: { time: 'O(n)', space: 'O(L)' },
};
