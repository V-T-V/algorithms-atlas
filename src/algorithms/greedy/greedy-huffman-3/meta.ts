// 霍夫曼编码 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'greedy-huffman-3',
  categoryId: 'greedy',
  title: { zh: '霍夫曼编码', en: 'Huffman Coding' },
  summary: {
    zh: '按频率贪心合并最小的两个节点，构造最优前缀码。',
    en: 'Greedily merge the two least-frequent nodes to build an optimal prefix code.',
  },
  description: {
    zh: '霍夫曼编码：每次从优先队列中取出两个最小频率节点合并，构造带权路径长度最小的二叉树。',
    en: 'Huffman coding: repeatedly extract the two least-frequent nodes and merge; produces a minimum-weighted-path tree.',
  },
  tags: ['greedy', 'tree', 'compression'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
