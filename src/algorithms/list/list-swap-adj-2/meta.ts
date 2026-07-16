// 两两交换v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'list-swap-adj-2',
  categoryId: 'list',
  title: { zh: '两两交换v2', en: 'Swap Adjacent Nodes v2' },
  summary: { zh: '相邻节点两两交换：A→B→C→D → B→A→D→C。', en: 'Swap every two adjacent nodes.' },
  description: {
    zh: 'dummy + 三指针，每次交换 prev.next 与 prev.next.next。',
    en: 'Dummy + relink pairs. O(n), O(1).',
  },
  tags: ['list', 'swap', 'pairs'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
