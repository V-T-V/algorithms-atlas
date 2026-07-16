// 拷贝随机指针v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'list-copy-random-2',
  categoryId: 'list',
  title: { zh: '拷贝随机指针v2', en: 'Copy List with Random Pointer v2' },
  summary: {
    zh: '深拷贝每个节点带 next 与 random 指针的链表。',
    en: 'Deep-copy a list whose nodes carry next and random pointers.',
  },
  description: {
    zh: '第一遍在原节点后插入拷贝，第二遍连接 random，第三遍拆分。',
    en: 'Interleave copies, link random, then split. O(n), O(1).',
  },
  tags: ['list', 'copy', 'random-pointer'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
