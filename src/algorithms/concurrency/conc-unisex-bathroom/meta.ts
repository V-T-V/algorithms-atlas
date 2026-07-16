// 单性别洗手间 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'conc-unisex-bathroom',
  categoryId: 'concurrency',
  title: { zh: '单性别洗手间问题', en: 'Unisex Bathroom Problem' },
  summary: {
    zh: '同一时刻洗手间只能容纳一种性别，且不超过容量上限。',
    en: 'The bathroom holds only one gender at a time and at most a capacity of people.',
  },
  description: {
    zh: '单性别洗手间问题：N 个隔间的洗手间同一时刻只能全部男或全部女。请求序列按时序到达，需在保证性别互斥的同时尽量公平。',
    en: 'The unisex bathroom problem: an N-stall bathroom may contain only men or only women at any time. Requests arrive over time and must respect gender exclusion while staying reasonably fair.',
  },
  tags: ['concurrency', 'synchronization', 'resource-sharing'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
