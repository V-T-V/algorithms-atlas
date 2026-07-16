// OPTICS 聚类 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ml-optics-clustering',
  categoryId: 'ml',
  title: { zh: 'OPTICS 聚类（密度可达排序）', en: 'OPTICS Clustering' },
  summary: {
    zh: '为每个点算核心距离与可达距离，输出按密度可达排序的点序；用 ξ 法提取簇。',
    en: 'Compute core/reachability distances, output points in density-reachable order; extract clusters via ξ method.',
  },
  description: {
    zh:
      'OPTICS（Ordering Points To Identify the Clustering Structure）：DBSCAN 的泛化，' +
      '不直接给标签，而是输出点的一个排序及其「可达距离」，可从中提取任意 ε 的聚类。' +
      '\n核心概念：' +
      '\n- ε 邻域：以点 p 为心、半径 ε 内的点集 Nε(p)' +
      '\n- 核心距离 core-dist(p)：使 p 成为核心点的最小半径（即 MinPts-近邻距离），若 |Nε(p)|<MinPts 则为 ∞' +
      '\n- 可达距离 reach-dist(p, o)：max(core-dist(o), dist(o, p))' +
      '\n算法：维护种子集，每次取出可达距离最小的点，更新其邻居的可达距离（类 Dijkstra）。' +
      '\n输出：点序 + 每点的可达距离（构成可达性图， valleys 对应簇）。' +
      '\n- 优点：可发现不同密度的簇；ε 取上限即可' +
      '\n- 时间 `O(n·log n)`（用优先队列），空间 `O(n)`。',
    en:
      'OPTICS (Ordering Points To Identify the Clustering Structure): a generalization of DBSCAN that ' +
      'outputs an ordering of points and their reachability distances, from which clusters at any ε can be extracted. ' +
      '\nKey concepts: ' +
      '\n- ε-neighborhood Nε(p): points within radius ε of p ' +
      '\n- core distance core-dist(p): the MinPts-nearest-neighbor distance (∞ if |Nε(p)| < MinPts) ' +
      '\n- reachability distance reach-dist(p, o) = max(core-dist(o), dist(o, p)) ' +
      '\nAlgorithm: maintain seeds, repeatedly extract the point with smallest reachability, update its neighbors (Dijkstra-like). ' +
      '\nOutput: point order + per-point reachability distance (the reachability plot; valleys are clusters). ' +
      '\n- Advantage: finds clusters of varying density; ε is just an upper bound ' +
      '\nTime O(n·log n) (with priority queue), space O(n).',
  },
  tags: ['ml', 'clustering', 'density', 'optics', 'dbscan-family'],
  complexity: { time: 'O(n·log n)', space: 'O(n)' },
};
