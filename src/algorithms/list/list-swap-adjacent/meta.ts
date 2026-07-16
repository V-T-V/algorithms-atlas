// Swap Adjacent Nodes · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'list-swap-adjacent',
  categoryId: 'list',
  title: { zh: '两两交换相邻节点', en: 'Swap Nodes in Pairs' },
  summary: {
    zh: '哑节点法两两交换链表中相邻节点。',
    en: 'Swap every two adjacent nodes using a dummy head.',
  },
  description: {
    zh: '从哑节点出发，每次处理相邻的两个节点：prev → a → b → rest 改为 prev → b → a → rest。',
    en: 'With a dummy head, repeatedly reconnect prev → a → b → rest into prev → b → a → rest.',
  },
  tags: ['list', 'two-pointers'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
