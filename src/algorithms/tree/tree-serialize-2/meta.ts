// 序列化v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'tree-serialize-2',
  categoryId: 'tree',
  title: { zh: '序列化v2', en: 'Serialize Tree v2' },
  summary: {
    zh: '把二叉树序列化为字符串（前序 + null 标记）。',
    en: 'Serialize a tree to a string (preorder + null markers).',
  },
  description: {
    zh: '前序遍历，空节点记 null，逗号分隔。',
    en: 'Preorder with null sentinels. O(n).',
  },
  tags: ['tree', 'serialize'],
  complexity: { time: 'O(n)', space: 'O(h)' },
};
