// 外星人字典 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'net-alien-dict',
  categoryId: 'network',
  title: { zh: '外星人字典', en: 'Alien Dictionary' },
  summary: {
    zh: '由排序后的单词列表推导字母顺序（拓扑排序）。',
    en: 'Infer letter order from sorted words (topo sort).',
  },
  description: {
    zh: '相邻词找首个不同字符建边，拓扑排序。',
    en: 'Build edges from adjacent word diffs; topo sort. O(C).',
  },
  tags: ['network', 'graph', 'topological-sort'],
  complexity: { time: 'O(C)', space: 'O(1)' },
};
