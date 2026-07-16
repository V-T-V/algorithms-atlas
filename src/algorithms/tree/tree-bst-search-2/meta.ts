// BST查找v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'tree-bst-search-2',
  categoryId: 'tree',
  title: { zh: 'BST查找v2', en: 'BST Search v2' },
  summary: { zh: '在 BST 中查找某值是否存在。', en: 'Search a value in a BST.' },
  description: { zh: '小于当前走左，大于走右，相等即命中。', en: 'Compare and descend. O(h).' },
  tags: ['tree', 'bst', 'search'],
  complexity: { time: 'O(h)', space: 'O(1)' },
};
