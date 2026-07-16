// 贪心点覆盖（Greedy Vertex Cover）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'greedy-min-vertex-cover',
  categoryId: 'greedy',
  title: { zh: '贪心点覆盖', en: 'Greedy Vertex Cover' },
  summary: {
    zh: '反复选最大度数顶点加入覆盖，近似最大匹配上界。',
    en: 'Repeatedly add the highest-degree vertex to the cover; approximates the matching upper bound.',
  },
  description: {
    zh: '贪心点覆盖：每次选当前度数最大的顶点加入覆盖，删除其所有边。2-近似（基于最大匹配）。',
    en: 'Greedy vertex cover: repeatedly pick max-degree vertex, remove incident edges. 2-approximation via maximal matching.',
  },
  tags: ['greedy', 'graph', 'approximation'],
  complexity: { time: 'O(|V|·|E|)', space: 'O(|V|+|E|)' },
};
