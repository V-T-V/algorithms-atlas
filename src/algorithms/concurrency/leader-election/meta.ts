// 环上领导者选举（LCR 算法）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'leader-election',
  categoryId: 'concurrency',
  title: { zh: '环上领导者选举（LCR）', en: 'Leader Election on a Ring (LCR)' },
  summary: {
    zh: '单向环上各进程向右传 id，更大者吞并更小者，最大 id 最终当选领导者。',
    en: 'On a unidirectional ring each process forwards its id rightward; larger swallows smaller, and the max id wins.',
  },
  description: {
    zh: 'LCR 算法（Lehmann, Chang & Roberts）在 n 个进程组成的单向环上选举领导者（唯一标识 id 互异）：\n\n1. 每个进程向右邻居发送自己的 id\n2. 收到 id 时：\n   - 若 id > 自己：转发（候选者还活着）\n   - 若 id < 自己：吞并（丢弃，候选者出局）\n   - 若 id == 自己：自己就是最大者，当选领导者，向环广播 elected\n3. 收到 elected 的进程标记领导并继续转发\n\n正确性：最大 id 不会被任何进程吞并（因为没人比它大），它会绕完整圈回到自己，于是当选。\n\n复杂度：消息数 O(n²)（最坏），轮次 O(n)。本实现模拟一个有向环上的 id 流转。',
    en: 'The LCR algorithm (Lehmann, Chang & Roberts) elects a leader among n processes on a unidirectional ring (distinct ids):\n\n1. Each process sends its own id to its right neighbor\n2. On receiving an id:\n   - If id > self: forward it (the candidate is still alive)\n   - If id < self: swallow it (candidate is out)\n   - If id == self: I am the maximum, become leader, broadcast elected\n3. Receivers of elected mark the leader and keep forwarding\n\nCorrectness: the maximum id is never swallowed (no one is larger), so it travels all the way around back to itself and wins.\n\nComplexity: O(n²) messages (worst case), O(n) rounds. This implementation simulates id flow on a directed ring.',
  },
  tags: ['concurrency', 'distributed', 'leader-election', 'ring'],
  complexity: { time: 'O(n²) messages', space: 'O(n)' },
  attributes: { model: '步骤序列模拟 / step-sequence simulation' },
  references: [
    {
      label: 'Chang & Roberts (1979). An improved algorithm for decentralized extrema-finding.',
      url: 'https://doi.org/10.1145/359156.359164',
    },
  ],
};
