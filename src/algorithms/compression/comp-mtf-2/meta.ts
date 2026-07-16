// MTF v2（Move-To-Front v2）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'comp-mtf-2',
  categoryId: 'compression',
  title: { zh: 'MTF v2', en: 'Move-To-Front v2' },
  summary: {
    zh: 'MTF：把符号输出为「在表中的位置」并移到最前。',
    en: 'MTF: emit a symbol table position, then move it to front.',
  },
  description: {
    zh: 'Move-To-Front 维护符号表，遇到符号时输出其当前索引并把它移到表头。常与 BWT 串联：BWT 后相同字符聚集，MTF 后变为小整数。',
    en: 'Move-To-Front maintains a symbol table; on each symbol it emits the current index and moves the symbol to the front. Often chained after BWT: BWT clusters chars, MTF turns them into small integers.',
  },
  tags: ['compression', 'mtf', 'transform', 'reversible'],
  complexity: { time: 'O(n·σ)', space: 'O(σ)' },
};
