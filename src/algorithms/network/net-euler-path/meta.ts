// 欧拉路径判断 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'net-euler-path',
  categoryId: 'network',
  title: { zh: '欧拉路径判断', en: 'Euler Path Check' },
  summary: {
    zh: '判断无向图是否存在欧拉路径/回路。',
    en: 'Check if an undirected graph has an Euler path/circuit.',
  },
  description: {
    zh: '连通且奇度点数为 0 或 2。',
    en: 'Connected and odd-degree count is 0 or 2. O(V+E).',
  },
  tags: ['network', 'graph', 'euler'],
  complexity: { time: 'O(V+E)', space: 'O(V)' },
};
