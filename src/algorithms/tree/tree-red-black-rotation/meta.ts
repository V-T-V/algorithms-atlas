// 红黑树旋转 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'tree-red-black-rotation',
  categoryId: 'tree',
  title: { zh: '红黑树旋转', en: 'Red-Black Tree Rotation' },
  summary: {
    zh: '红黑树插入修复使用的左旋/右旋，配合重着色维持平衡。',
    en: 'Left/right rotations used during red-black tree insert fixup, paired with recoloring to keep the tree balanced.',
  },
  description: {
    zh: '红黑树性质：\n1. 每个节点是红或黑\n2. 根是黑\n3. 叶子（NIL）是黑\n4. 红节点的两个儿子都是黑\n5. 任意节点到子树叶子路径上的黑节点数相同（黑高）\n\n插入新节点为红。若父节点也是红，违反性质 4：\n- Case 1：叔节点为红 → 把父、叔染黑，祖父染红，向上递推\n- Case 2/3：叔节点为黑，且新节点相对父、祖父呈"折线"→ 先旋转父拉直（左旋/右旋），然后对祖父旋转并交换父/祖父颜色\n\n旋转本身 O(1)，插入修复最多 O(log n) 次重着色 + 2 次旋转。',
    en: 'Red-black invariants: every node red/black, root black, NIL black, no two consecutive reds, equal black-height across paths. New node inserted red; if parent is also red we fixup: (1) red uncle → recolor parent/uncle black, grandparent red, recurse; (2)/(3) black uncle with a zigzag → rotate parent to straighten, then rotate grandparent and swap colors. O(1) per rotation, O(log n) recolors + at most 2 rotations per insertion.',
  },
  tags: ['tree', 'red-black-tree', 'rotation', 'self-balancing', 'binary-search-tree'],
  complexity: { time: 'O(log n) 每次插入', space: 'O(log n) 递归栈' },
};
