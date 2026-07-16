// 近邻传播聚类 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ml-affinity-propagation',
  categoryId: 'ml',
  title: { zh: '近邻传播聚类（Affinity Propagation）', en: 'Affinity Propagation' },
  summary: {
    zh: '在点对间传递责任度 R 与可用度 A，迭代收敛后自动选出代表点（簇心）。',
    en: 'Iteratively pass responsibility R and availability A between point pairs to auto-select exemplars.',
  },
  description: {
    zh:
      '近邻传播聚类（Affinity Propagation）：基于消息传递的聚类，无需预设簇数。' +
      '\n核心量：' +
      '\n- 相似度 s(i,k)：通常取 −||xi−xk||²；对角线 s(k,k) 称「偏好度」preference，决定 k 成为代表点的先验倾向' +
      '\n- 责任度 r(i,k)：从 i 发往 k，表示「k 作为 i 的代表点有多合适」（扣除其他竞争者）' +
      "  r(i,k) = s(i,k) − max_{k'≠k}{ a(i,k') + s(i,k') }" +
      '\n- 可用度 a(i,k)：从 k 发往 i，表示「k 作为代表点对 i 的可用程度」' +
      "  a(i,k) = min{ 0, r(k,k) + Σ_{i'∉{i,k}} max{0, r(i',k)} }，a(k,k) 为自可用度" +
      '\n- 阻尼 λ∈[0,1]：r ← λ·r_old + (1−λ)·r_new，平滑防振荡（典型 λ=0.5）' +
      '\n收敛后：每个点 i 选择 argmax_k {a(i,k)+r(i,k)} 作为代表点，代表点本身即簇心' +
      '\n- 优点：簇数自动确定；preference 越大簇越多' +
      '\n- 时间 `O(T·n²)`（T 次迭代），空间 `O(n²)`。',
    en:
      'Affinity Propagation: message-passing clustering that needs no preset cluster count. ' +
      '\nKey quantities: ' +
      '\n- Similarity s(i,k): typically −||xi−xk||²; diagonal s(k,k) is the "preference" governing how likely k is to be an exemplar ' +
      '\n- Responsibility r(i,k): from i to k, "how suitable k is as i\'s exemplar" (discounting competitors): ' +
      "  r(i,k) = s(i,k) − max_{k'≠k}{ a(i,k') + s(i,k') } " +
      '\n- Availability a(i,k): from k to i, "how available k is as an exemplar for i": ' +
      "  a(i,k) = min{ 0, r(k,k) + Σ_{i'∉{i,k}} max{0, r(i',k)} }; a(k,k) is self-availability " +
      '\n- Damping λ∈[0,1]: r ← λ·r_old + (1−λ)·r_new to prevent oscillation (λ=0.5 typical) ' +
      '\nAt convergence each point i picks argmax_k {a(i,k)+r(i,k)}; exemplars are cluster centers. ' +
      '\n- Advantage: cluster count emerges automatically; larger preference → more clusters ' +
      '\nTime O(T·n²) (T iterations), space O(n²).',
  },
  tags: ['ml', 'clustering', 'message-passing', 'affinity-propagation'],
  complexity: { time: 'O(T·n²)', space: 'O(n²)' },
};
