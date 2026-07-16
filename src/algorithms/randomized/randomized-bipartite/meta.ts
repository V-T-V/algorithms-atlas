// Randomized Bipartite Matching · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'randomized-bipartite',
  categoryId: 'randomized',
  title: { zh: '随机化二分图最大匹配', en: 'Randomized Bipartite Matching' },
  summary: {
    zh: '随机化近似二分图最大匹配：以随机顺序反复尝试增广路径，期望匹配数 ≥ (1/2)·|最大匹配|，常用于流式/在线场景。',
    en: 'Randomized approximation of maximum bipartite matching: greedily attempt augmenting paths in random order; expected size ≥ (1/2)·|max matching|, useful in streaming/online settings.',
  },
  description: {
    zh: '确定性求最大匹配（如 Hopcroft–Karp）是 O(E·√V)，但很多场景（动态图、流式、在线）需要更轻量的随机化算法。这里实现两个层次：(1) 随机化贪心匹配——把所有边按随机顺序排序，若两端均未匹配则选入；期望匹配数至少是最大匹配的一半。(2) 随机化增广——以随机顺序对每个未匹配左点尝试找一条增广路径（带随机化 DFS 探索邻居顺序），找到则翻转；多次重复逼近最大匹配。核心引理：随机顺序贪心在期望意义下是 1/2 近似；反复随机增广在多项式次后以高概率达到最大匹配。这是 Monte Carlo / Las Vegas 风格在组合优化中的经典应用。',
    en: 'Computing maximum bipartite matching deterministically (e.g. Hopcroft–Karp) costs O(E·√V), but many settings (dynamic graphs, streaming, online) need lighter randomized algorithms. We implement two layers: (1) randomized greedy matching — sort all edges in random order and pick an edge whenever both ends are free; the expected matching size is at least half the maximum. (2) randomized augmentation — for each unmatched left vertex, attempt to find an augmenting path by a DFS whose neighbor order is randomized, and flip if found; repeat to approach the maximum. The key lemma: randomized greedy is a 1/2-approximation in expectation; repeated randomized augmentation reaches the optimum with high probability in polynomial rounds. A classic Monte Carlo / Las Vegas use in combinatorial optimization.',
  },
  tags: ["randomized","bipartite-matching"],
  complexity: { time: 'O(V·E)', space: 'O(V+E)' },
};
