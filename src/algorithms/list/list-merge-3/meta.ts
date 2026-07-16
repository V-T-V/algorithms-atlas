// 合并有序链表v3 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'list-merge-3',
  categoryId: 'list',
  title: { zh: '合并有序链表v3', en: 'Merge Two Sorted Lists v3' },
  summary: {
    zh: '迭代合并两个升序链表为一个新的升序链表。',
    en: 'Iteratively merge two ascending lists into one.',
  },
  description: {
    zh: '用 dummy 头 + tail 指针：每步取较小节点接到 tail 后。O(n+m)。',
    en: 'Dummy head + tail; append the smaller each step. O(n+m).',
  },
  tags: ['list', 'merge', 'two-pointers'],
  complexity: { time: 'O(n+m)', space: 'O(1)' },
};
