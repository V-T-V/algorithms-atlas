// 删倒数第n · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'list-remove-nth-2',
  categoryId: 'list',
  title: { zh: '删倒数第n', en: 'Remove Nth From End v2' },
  summary: { zh: '一次遍历删除倒数第 n 个节点。', en: 'Remove the nth node from end in one pass.' },
  description: {
    zh: 'fast 先走 n 步，再 slow/fast 同步走；fast 到末尾时 slow.next 即待删节点。',
    en: 'fast advances n first, then move together. O(n), O(1).',
  },
  tags: ['list', 'remove', 'two-pointers'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
