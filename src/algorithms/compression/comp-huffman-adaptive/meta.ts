// 自适应 Huffman · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'comp-huffman-adaptive',
  categoryId: 'compression',
  title: { zh: '自适应 Huffman', en: 'Adaptive Huffman' },
  summary: {
    zh: '单遍编码：边读入边更新 Huffman 树，无需预先统计频率，收发双方同步。',
    en: 'Single-pass coding: update the Huffman tree as symbols arrive; sender and receiver stay in sync without precomputed frequencies.',
  },
  description: {
    zh: '自适应 Huffman（FGK 算法）在编码时动态维护一棵 Huffman 树：\n\n- 每读入一个符号，若为新符号则先输出 NYT（Not Yet Transmitted）码 + 原始字节，再插入新叶。\n- 已存在符号则输出其当前码字。\n- 然后沿路径更新节点权重并做 sibling swap，维持有序性（同权重节点按编号分组）。\n- 单遍即可完成，适合流式数据。',
    en: 'Adaptive Huffman (FGK algorithm) maintains a live Huffman tree:\n\n- On a new symbol, emit the NYT (Not Yet Transmitted) code plus the raw byte, then add a leaf.\n- On a known symbol, emit its current codeword.\n- Then walk the path updating node weights and swapping siblings to preserve ordering (same-weight nodes grouped by number).\n- Single-pass, ideal for streaming.',
  },
  tags: ['compression', 'entropy', 'huffman', 'adaptive'],
  complexity: { time: 'O(n·L)', space: 'O(U)' },
};
