// Tunstall 编码 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'comp-tunstall',
  categoryId: 'compression',
  title: { zh: 'Tunstall 编码', en: 'Tunstall Coding' },
  summary: {
    zh: '定长码、变长输入：把高频符号扩展成等长前缀串，每串映射为定长码字。',
    en: 'Fixed-length code, variable-length input: expand frequent symbols into equal-length prefix strings, each mapped to a fixed-length codeword.',
  },
  description: {
    zh: 'Tunstall 编码与 Huffman 互补——Huffman 是变长码定长输入，Tunstall 是定长码变长输入：\n\n- 从单符号开始构建一棵字典树，每次选取概率最大的叶节点扩展（用其接所有可能符号）。\n- 重复直到叶节点数达到 2^L。\n- 每个叶子映射为 L 位定长码字。\n- 解码时每次读固定 L 位，查表还原原始字符串。',
    en: 'Tunstall is the dual of Huffman — Huffman uses variable-length codes for fixed inputs, Tunstall uses fixed-length codes for variable inputs:\n\n- Build a dictionary tree from single symbols; repeatedly expand the highest-probability leaf (appending each possible symbol).\n- Repeat until 2^L leaves exist.\n- Each leaf maps to an L-bit fixed codeword.\n- Decoder reads fixed L bits and looks up the original string.',
  },
  tags: ['compression', 'entropy', 'fixed-length'],
  complexity: { time: 'O(2^L · |Σ|)', space: 'O(2^L)' },
};
