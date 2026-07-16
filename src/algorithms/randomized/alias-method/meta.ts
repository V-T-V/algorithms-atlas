// Alias Method · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'alias-method',
  categoryId: 'randomized',
  title: { zh: '别名法采样', en: 'Alias Method Sampling' },
  summary: {
    zh: '按给定离散概率分布 O(1) 采样：O(n) 预处理后每次抽取常数时间。',
    en: 'Sample from a discrete distribution in O(1) after O(n) preprocessing.',
  },
  description: {
    zh: '别名法（Alias Method，Vose 法）用于按任意离散概率分布高效采样。预处理阶段用两个数组 `prob[i]` 与 `alias[i]` 构造一张表：把每个桶的列高凑成 1，多出的部分「借」给别处的桶。\n\n- 预处理 O(n)：维护「小」（概率 <1）与「大」（概率 ≥1）两个栈，反复配对，把大概率桶多余的概率匀给小概率桶，并记录 alias 关系。\n- 采样 O(1)：随机取桶 i ∈ [0,n)，再掷一次硬币决定取 i 还是 alias[i]。\n\n这使它在需要从同一分布反复采样（如蒙特卡洛、加权随机）时远优于轮盘法 O(n)。',
    en: 'The Alias Method (Vose\'s variant) samples from any discrete probability distribution efficiently. Preprocessing builds two arrays, `prob[i]` and `alias[i]`, representing a table where each column has height 1 and the "excess" of large-probability columns is loaned to small ones.\n\n- Preprocessing O(n): maintain "small" (prob < 1) and "large" (prob ≥ 1) stacks, repeatedly pair them, transferring probability mass from large to small and recording the alias.\n- Sampling O(1): pick a column i ∈ [0,n), then flip a coin to choose between i and alias[i].\n\nThis makes it far better than O(n) roulette-wheel selection when repeatedly sampling from the same distribution (e.g. Monte Carlo, weighted random choice).',
  },
  tags: ['randomized', 'sampling', 'discrete-distribution', 'data-structure'],
  complexity: { time: 'O(n) build, O(1) sample', space: 'O(n)' },
};
