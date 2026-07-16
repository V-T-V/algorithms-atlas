// 并行 MCTS（Parallel Monte Carlo Tree Search）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'parallel-mcts',
  categoryId: 'ai-search',
  title: { zh: '并行 MCTS', en: 'Parallel Monte Carlo Tree Search' },
  summary: {
    zh: '多线程并行执行 MCTS 的选择/模拟：树并行（锁节点）+ 根并行（独立树投票）。',
    en: 'Run MCTS selection/simulation in parallel: tree parallelism (locked nodes) + root parallelism (independent trees vote).',
  },
  description: {
    zh: 'MCTS 是「尴尬并行」的——每次迭代之间大多独立。Chaslot 等人提出三种并行策略：\n\n1. **树并行（Tree Parallelism）**：多个线程共享同一棵树。线程沿 UCB 选择下行时，对经过的节点加「虚拟损失」（virtual loss）使其他线程避开同一支路；回传时撤销虚拟损失。需要线程同步，但树共享。\n2. **根并行（Root Parallelism）**：每个线程独立建一棵树，最后通过投票/求和合并根节点统计。\n3. **叶并行（Leaf Parallelism）**：选到一个叶后，从该叶并行发起多次 rollout。\n\n本实现是单线程模拟「虚拟损失」版的树并行 MCTS：用确定性 RNG 序列模拟多个 worker 串行执行，每个 worker 在选择路径上加虚拟损失。在数值 K-臂问题上与普通 MCTS 收敛到同一最优臂。',
    en: 'MCTS is "embarrassingly parallel" — most iterations are mutually independent. Chaslot et al. proposed three strategies:\n\n1. **Tree Parallelism**: multiple threads share one tree. As a thread descends via UCB, it adds a *virtual loss* to each node on its path so other threads avoid the same branch; the loss is undone on backprop. Requires synchronization but shares the tree.\n2. **Root Parallelism**: each thread builds its own tree; results are merged by voting/sum at the root.\n3. **Leaf Parallelism**: after selecting a leaf, fire multiple rollouts in parallel from it.\n\nThis implementation is a single-threaded *simulation* of virtual-loss tree-parallel MCTS: deterministic RNG sequences emulate multiple workers running serially, each adding virtual loss on its selection path. On a numeric K-armed bandit it converges to the same best arm as plain MCTS.',
  },
  tags: ['ai-search', 'mcts', 'parallel', 'virtual-loss'],
  complexity: { time: 'O(iterations · depth)', space: 'O(iterations · depth)' },
  references: [
    {
      label: 'Parallel MCTS — Chaslot et al.',
      url: 'https://www.cs.ucsb.edu/~holl/CS290I/Papers/ParallelMCTS-CIG2008.pdf',
    },
  ],
};
