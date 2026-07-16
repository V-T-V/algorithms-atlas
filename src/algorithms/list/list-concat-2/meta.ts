// 连接两表v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'list-concat-2',
  categoryId: 'list',
  title: { zh: '连接两表v2', en: 'Concatenate Two Lists v2' },
  summary: { zh: '把链表 b 接到链表 a 的末尾。', en: 'Append list b to the end of list a.' },
  description: {
    zh: '找到 a 的尾节点，next 指向 b。',
    en: 'Find tail of a, set its next to b. O(n), O(1).',
  },
  tags: ['list', 'concat'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
