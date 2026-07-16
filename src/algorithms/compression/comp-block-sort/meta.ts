// 块排序 (BWT 变种) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'comp-block-sort',
  categoryId: 'compression',
  title: { zh: '块排序 (BWT 变种)', en: 'Block Sorting (BWT variant)' },
  summary: {
    zh: '把输入分块，每块做循环旋转排序取末列，使相同字符聚集便于后续压缩。',
    en: 'Split input into blocks, sort cyclic rotations per block, and take the last column to cluster similar characters.',
  },
  description: {
    zh: '块排序是 Burrows-Wheeler 的分块应用：\n\n- 把输入切成定长块。\n- 每块生成所有循环旋转，按字典序排序。\n- 取排序后矩阵的最后一列 + 原始行索引。\n- 末列中相同字符聚集，配合 MTF/RLE 能高效压缩。\n- 解码用「先列后排序」的反向变换。',
    en: 'Block sorting applies Burrows-Wheeler in blocks:\n\n- Split the input into fixed-size blocks.\n- Generate all cyclic rotations per block and sort lexicographically.\n- Take the last column plus the original row index.\n- The last column clusters identical characters, enabling efficient MTF/RLE.\n- Inverse uses the "first column via sort" reverse transform.',
  },
  tags: ['compression', 'transform', 'bwt'],
  complexity: { time: 'O(n^2 log n) 每块', space: 'O(n)' },
};
