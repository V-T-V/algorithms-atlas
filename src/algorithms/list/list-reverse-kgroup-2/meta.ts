// k个一组反转v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'list-reverse-kgroup-2',
  categoryId: 'list',
  title: { zh: 'k个一组反转v2', en: 'Reverse Nodes in k-Group v2' },
  summary: {
    zh: '每 k 个节点一组反转；不足 k 个保持原序。',
    en: 'Reverse in groups of k; leave the last partial group as-is.',
  },
  description: {
    zh: '先统计长度，按组翻转，组间重新连接。',
    en: 'Count length, flip each full group, relink. O(n), O(1).',
  },
  tags: ['list', 'reverse', 'group'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
