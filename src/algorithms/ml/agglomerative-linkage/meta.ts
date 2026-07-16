// 凝聚层次聚类（链接策略）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ml-agglomerative-linkage',
  categoryId: 'ml',
  title: { zh: '凝聚层次聚类（链接策略）', en: 'Agglomerative Hierarchical Clustering (Linkage)' },
  summary: {
    zh: '自底向上：每步把最相近两簇合并，支持单链接/全链接/平均链接。',
    en: 'Bottom-up: merge the closest pair of clusters each step with single/complete/average linkage.',
  },
  description: {
    zh:
      '凝聚层次聚类（Agglomerative Hierarchical Clustering）：自底向上的层次聚类。' +
      '\n- 初始每个点自成一类' +
      '\n- 每步把「距离最近」的两簇合并为一簇，直到只剩一类（或达到目标簇数）' +
      '\n簇间距离（链接策略）：' +
      '\n- 单链接（single）：min{d(a,b) | a∈A, b∈B}（最近点距离）' +
      '\n- 全链接（complete）：max{d(a,b)}（最远点距离）' +
      '\n- 平均链接（average）：mean{d(a,b)}' +
      '\n- 中心链接（centroid）：两簇质心距离' +
      '\n合并过程记录为树状图（dendrogram），可在任意高度切分得到不同粒度的簇。' +
      '\n- 时间 `O(n³)`（朴素实现），空间 `O(n²)`。',
    en:
      'Agglomerative Hierarchical Clustering: bottom-up hierarchical clustering. ' +
      '\n- Start with each point as its own cluster ' +
      '\n- Each step merge the two closest clusters until one remains (or target count reached) ' +
      '\nInter-cluster distance (linkage strategies): ' +
      '\n- Single linkage: min{d(a,b) | a∈A, b∈B} ' +
      '\n- Complete linkage: max{d(a,b)} ' +
      '\n- Average linkage: mean{d(a,b)} ' +
      '\n- Centroid linkage: distance between centroids ' +
      '\nThe merge sequence forms a dendrogram; cutting at any height yields clusters at that granularity. ' +
      '\nTime O(n³) (naive), space O(n²).',
  },
  tags: ['ml', 'clustering', 'hierarchical', 'agglomerative', 'linkage'],
  complexity: { time: 'O(n³)', space: 'O(n²)' },
};
