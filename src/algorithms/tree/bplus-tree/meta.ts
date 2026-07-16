// B+ Tree · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bplus-tree',
  categoryId: 'tree',
  title: { zh: 'B+ 树', en: 'B+ Tree' },
  summary: {
    zh: '数据只存叶子、内部节点仅存索引键，叶子串成有序链表。',
    en: 'Data lives only in leaves; internal nodes hold index keys and leaves form an ordered linked list.',
  },
  description: {
    zh: 'B+ 树（B+ Tree）是 B 树的变体，广泛用于数据库与文件系统索引。区别于 B 树：\n\n1. **所有数据记录只存于叶子节点**，内部节点仅存「索引键」用于路由。\n2. **叶子节点按序用指针串成链表**，支持高效的范围查询与顺序遍历。\n3. 内部节点的某个键 = 其右子树中最小键，即对应叶子中实际存在的键。\n\n每个节点（含内部与叶子）的子节点数在 ⌈m/2⌉ ~ m 之间（m 为阶）。插入时若节点超上限则分裂并向上提升中间键；删除时若低于下限则借键或合并。查找 / 插入 / 删除均为 O(log_m n)，范围查询 O(log_m n + k)。空间 O(n)。',
    en: 'The B+ Tree is a B-tree variant widely used in database and filesystem indexes. Unlike a B tree:\n\n1. **All data records live only in leaf nodes**; internal nodes store only "index keys" for routing.\n2. **Leaf nodes are chained by pointers** in order, enabling efficient range queries and sequential scans.\n3. A key in an internal node equals the smallest key in its right subtree — it always exists in some leaf.\n\nEach node (internal or leaf) has between ⌈m/2⌉ and m children (m = order). On overflow a node splits and pushes its middle key up; on underflow it borrows or merges. Search / insert / delete are all O(log_m n); range query is O(log_m n + k). Space O(n).',
  },
  tags: ['tree', 'b-tree', 'balanced', 'index', 'database', 'multiway'],
  complexity: { time: 'O(log_m n)', space: 'O(n)' },
  attributes: { 'leaf-chain': 'true', 'data-in-leaves': 'true' },
};
