// Delete the Middle Node · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'list-delete-middle',
  categoryId: 'list',
  title: { zh: '删除链表中间节点', en: 'Delete the Middle Node' },
  summary: {
    zh: '快慢指针定位并删除链表正中节点（LeetCode 2095）。',
    en: 'Fast/slow pointers locate and remove the middle node (LeetCode 2095).',
  },
  description: {
    zh: '用前驱指针配合快慢指针，找到中间节点的前驱后跳过中间节点完成删除。',
    en: 'Use a prev pointer alongside slow/fast to skip the middle node once found.',
  },
  tags: ['list', 'two-pointers'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
