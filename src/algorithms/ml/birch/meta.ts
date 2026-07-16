// BIRCH 聚类（CF 树）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ml-birch',
  categoryId: 'ml',
  title: { zh: 'BIRCH 聚类（CF 树）', en: 'BIRCH Clustering (CF Tree)' },
  summary: {
    zh: '用聚类特征 (CF) 三元组 (N, LS, SS) 增量建树，单遍扫描大数据集聚类。',
    en: 'Incrementally build a Clustering Feature tree (N, LS, SS) for single-pass clustering of large datasets.',
  },
  description: {
    zh:
      'BIRCH（Balanced Iterative Reducing and Clustering using Hierarchies）：为大规模数据设计的聚类。' +
      '\n核心数据结构——聚类特征（Clustering Feature, CF）：' +
      '\n- CF = (N, LS, SS)' +
      '\n- N：子簇中点数' +
      '\n- LS：线性和 Σx_i（向量）' +
      '\n- SS：标量和 Σ||x_i||²' +
      '\nCF 可加：CF1 + CF2 = (N1+N2, LS1+LS2, SS1+SS2)，便于合并' +
      '\n由 CF 可推导：质心 = LS/N，半径 = √(SS/N − ||LS/N||²)' +
      '\n算法：' +
      '\n1. 单遍扫描：每个点从根下降，选最近子簇，若加入后半径 ≤ 阈值 T 则吸收，否则新建叶条目' +
      '\n2. （可选）多阶段：重建更紧凑的 CF 树' +
      '\n3. 用全局聚类（如 K-均值/层次）对叶条目聚类得到最终标签' +
      '\n- 优点：内存高效（只存 CF），线性时间，支持流式数据' +
      '\n- 时间 `O(n)`（单遍扫描），空间 `O(叶子数)`。',
    en:
      'BIRCH (Balanced Iterative Reducing and Clustering using Hierarchies): designed for large-scale data. ' +
      '\nCore data structure — the Clustering Feature (CF): ' +
      '\n- CF = (N, LS, SS) ' +
      '\n- N: number of points in the subcluster ' +
      '\n- LS: linear sum Σx_i (vector) ' +
      '\n- SS: scalar sum Σ||x_i||² ' +
      '\nCFs are additive: CF1 + CF2 = (N1+N2, LS1+LS2, SS1+SS2), easy to merge. ' +
      '\nFrom CF: centroid = LS/N, radius = √(SS/N − ||LS/N||²). ' +
      '\nAlgorithm: ' +
      '\n1. Single pass: each point descends from root, joins the nearest subcluster if radius stays ≤ threshold T, else starts a new leaf entry ' +
      '\n2. (Optional) rebuild a tighter CF tree ' +
      '\n3. Apply global clustering (K-Means / hierarchical) to leaf entries for final labels ' +
      '\n- Advantages: memory-efficient (stores only CFs), linear time, streaming-friendly ' +
      '\nTime O(n) (single pass), space O(#leaves).',
  },
  tags: ['ml', 'clustering', 'birch', 'cf-tree', 'streaming'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
