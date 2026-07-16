// 找环入口v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'list-detect-cycle-start-2',
  categoryId: 'list',
  title: { zh: '找环入口v2', en: 'Find Cycle Start v2' },
  summary: {
    zh: 'Floyd 判环后定位环的入口节点。',
    en: 'Locate the cycle entry after Floyd detection.',
  },
  description: {
    zh: '快慢相遇后，把一指针放回头，两者同速再相遇即环入口。',
    en: 'After meeting, reset one to head; meet at entry. O(n), O(1).',
  },
  tags: ['list', 'cycle', 'floyd'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
