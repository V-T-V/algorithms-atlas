// Brotli 上下文模型（Brotli Context Model）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'comp-brotli-context',
  categoryId: 'compression',
  title: { zh: 'Brotli 上下文模型', en: 'Brotli Context Model' },
  summary: { zh: '依前两字节选 Huffman 表。', en: 'Selects Huffman table by prev 2 bytes.' },
  description: {
    zh: 'Brotli 上下文模型用前 1-2 字节作为上下文，为每个上下文维护独立的 Huffman 概率表，提升文本压缩率。',
    en: 'Brotli context model keys Huffman tables by the previous 1-2 bytes, boosting text compression over static Huffman.',
  },
  tags: ['compression', 'brotli', 'context-model'],
  complexity: { time: 'O(n)', space: 'O(c*256)' },
};
