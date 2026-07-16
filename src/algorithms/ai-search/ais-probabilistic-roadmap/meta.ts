// 概率路线图 PRM（Probabilistic Roadmap）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ais-probabilistic-roadmap',
  categoryId: 'ai-search',
  title: { zh: '概率路线图 PRM', en: 'Probabilistic Roadmap' },
  summary: {
    zh: '随机采样构造运动规划路线图。',
    en: 'Random-sampling roadmap for motion planning.',
  },
  description: {
    zh: 'PRM 在自由空间随机采样若干节点并连接可见邻居形成图，再在图上做最短路径查询，是机器人运动规划经典方法。',
    en: 'PRM samples nodes in free space, connects visible neighbors into a roadmap, then queries shortest path; a classic motion-planning method.',
  },
  tags: ['ai-search', 'prm', 'motion-planning', 'sampling'],
  complexity: { time: 'O(n^2) build', space: 'O(n^2)' },
};
