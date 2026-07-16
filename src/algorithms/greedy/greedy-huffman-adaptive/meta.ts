// 自适应哈夫曼（Adaptive Huffman）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'greedy-huffman-adaptive',
  categoryId: 'greedy',
  title: { zh: '自适应哈夫曼', en: 'Adaptive Huffman' },
  summary: {
    zh: '动态构建哈夫曼树，无需预先知道频率，适合流式压缩。',
    en: 'Build Huffman tree dynamically without prior frequencies; suited for streaming compression.',
  },
  description: {
    zh: '自适应哈夫曼（FGK 算法简化）：随符号到达更新权重并旋转，编码与解码同步进行，单遍完成。',
    en: 'Adaptive Huffman (FGK simplified): update weights and rotate as symbols arrive; encoder/decoder stay synchronized in one pass.',
  },
  tags: ['greedy', 'huffman', 'compression'],
  complexity: { time: 'O(n log n)', space: 'O(σ)' },
};
