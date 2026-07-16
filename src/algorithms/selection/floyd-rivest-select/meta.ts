// Floyd-Rivest 选择 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'floyd-rivest-select',
  categoryId: 'selection',
  title: { zh: 'Floyd-Rivest 选择', en: 'Floyd-Rivest Select' },
  summary: {
    zh: '用两个动态收缩的基准 i、j 围出第 k 小，平均比较次数最少。',
    en: 'Select k-th using two dynamic pivots i, j that bracket k; fewest average comparisons.',
  },
  description: {
    zh: 'Floyd-Rivest 选择算法：随机采样两个基准 i ≤ j，把数组划成 <a[i]、[a[i],a[j]]、>a[j] 三段；根据 k 落在哪段只递归那一段，并动态收紧 i、j。\n\n- 当 n 小时退回排序\n- 采样基准后通过三向划分收敛\n- 实际比较次数约为 1.5n，是平均最快的选择算法之一',
    en: 'Floyd-Rivest selection: sample two pivots i <= j, partition into <a[i], [a[i],a[j]], >a[j]; recurse only into the bracket containing k, dynamically tightening i and j.\n\n- Fall back to sort for small n\n- After sampling pivots converge via 3-way partition\n- Average comparisons ~1.5n, among the fastest selection algorithms',
  },
  tags: ["selection","shortest-path","sorting"],
  complexity: { time: 'O(n) 期望', space: 'O(log n)' },
};
