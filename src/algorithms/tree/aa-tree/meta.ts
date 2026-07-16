// AA Tree · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'aa-tree',
  categoryId: 'tree',
  title: { zh: 'AA 树', en: 'AA Tree' },
  summary: {
    zh: '红黑树的简化变体：只允许右倾节点，用 level 代替颜色。',
    en: 'A simplified red-black variant: only right-leaning red links, using level instead of color.',
  },
  description: {
    zh: 'AA 树（AA Tree）由 Arne Andersson 提出，是红黑树的一种简化变体。它把红黑树的「颜色」替换为整数 level（叶子的 level=1），并规定：\n\n1. 每个左孩子的 level 严格小于父节点（即左倾红链被禁止，红节点只能是右孩子）。\n2. 每个右孩子的 level 等于或小于父节点（相等即右倾红链）。\n3. 删除时若子节点 level 比本节点低超过 1，则降低本节点 level。\n\n插入/删除后只需两个对称的修复操作：skew（右旋，把左倾变右倾）与 split（左旋 + 提升 level，处理连续右倾红链）。相比红黑树，AA 树的实现更短、更容易写对，性能相当。查找/插入/删除 O(log n)，空间 O(n)。',
    en: 'The AA Tree, introduced by Arne Andersson, is a simplified variant of the red-black tree. It replaces "color" with an integer level (leaves have level=1) and enforces:\n\n1. Every left child has a strictly smaller level than its parent (left-leaning red links are forbidden; red nodes may only be right children).\n2. Every right child has a level equal to or less than its parent (equal = right-leaning red link).\n3. On delete, if a child\'s level is more than 1 below the node, lower the node\'s level.\n\nAfter insert/delete only two symmetric fixups are needed: skew (right rotation to turn a left link into a right one) and split (left rotation + level bump to handle two consecutive right-leaning red links). Compared with red-black trees the code is much shorter and easier to get right, with comparable performance. Search/insert/delete O(log n), space O(n).',
  },
  tags: ['tree', 'bst', 'self-balancing', 'red-black', 'rotation'],
  complexity: { time: 'O(log n)', space: 'O(n)' },
  attributes: { balance: 'level-based', 'right-leaning': 'true' },
};
