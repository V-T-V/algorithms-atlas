// Insert into Sorted Circular List · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'list-insert-circular-sorted',
  categoryId: 'list',
  title: { zh: '循环有序链表插入', en: 'Insert into a Sorted Circular List' },
  summary: {
    zh: '将节点插入升序循环链表并保持有序。',
    en: 'Insert a node into an ascending circular list keeping it sorted.',
  },
  description: {
    zh: '遍历循环链表找到 insertVal 的正确位置（prev ≤ x ≤ next），处理最大/最小边界情况。',
    en: 'Walk the circular list to find where prev ≤ x ≤ next, handling the min/max wrap-around.',
  },
  tags: ['list', 'circular'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
