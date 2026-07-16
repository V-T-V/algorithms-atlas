// Copy List with Random Pointer (Variant) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'list-copy-with-random-2',
  categoryId: 'list',
  title: { zh: '带随机指针深拷贝（穿插法）', en: 'Copy List with Random Pointer (Weave Variant)' },
  summary: {
    zh: 'O(1) 空间穿插复制节点再分离，深拷贝带随机指针的链表。',
    en: 'O(1) space: weave copied nodes between originals then split to deep-copy random pointers.',
  },
  description: {
    zh: '把每个复制节点穿插在原节点之后，复制 random 指针后再分离两条链表。',
    en: 'Interleave each copy after its original, copy random links, then split the two lists apart.',
  },
  tags: ['list', 'deep-copy', 'hash'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
