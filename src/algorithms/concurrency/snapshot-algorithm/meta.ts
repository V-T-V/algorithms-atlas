// 分布式快照（Chandy-Lamport）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'snapshot-algorithm',
  categoryId: 'concurrency',
  title: { zh: '分布式快照（Chandy-Lamport）', en: 'Distributed Snapshot (Chandy-Lamport)' },
  summary: {
    zh: '协调者发 marker：收到首个 marker 前的消息即该通道上的快照状态，无需冻结系统。',
    en: 'Coordinator sends markers: messages before the first marker on a channel form its snapshot, no global freeze needed.',
  },
  description: {
    zh: 'Chandy-Lamport 算法（K. M. Chandy & L. Lamport, 1985）在不停止系统的前提下记录分布式全局状态：\n\n1. 协调进程 P 对自己每条出向通道发一个 marker，然后记录自己的当前状态\n2. 进程 Q 收到来自通道 C 的首个 marker 时：\n   - 记录自己的状态\n   - 把通道 C 标记为「空」，从此刻起 C 上收到的消息被记录为该通道状态\n   - 向自己所有出向通道发 marker\n3. 收到非首个 marker 时：把该通道上累积的消息作为该通道状态\n\n当进程对所有入向通道都收到 marker 时，快照完成。\n\n正确性：在 FIFO 通道下，记录的全局状态是一个「可达的」一致切割。本实现模拟若干进程与有向通道上的 marker 扩散。',
    en: "The Chandy-Lamport algorithm (K. M. Chandy & L. Lamport, 1985) records a distributed global state without stopping the system:\n\n1. Coordinator P sends a marker on every outgoing channel, then records its own state\n2. Process Q receiving the first marker on channel C:\n   - Records its own state\n   - Marks channel C empty; subsequent messages on C become that channel's recorded state\n   - Sends markers on all its outgoing channels\n3. On non-first markers: accumulated messages on that channel form its recorded state\n\nA process completes when it has received markers on all incoming channels.\n\nCorrectness: with FIFO channels the recorded global state is a reachable consistent cut. This implementation simulates marker diffusion across processes and directed channels.",
  },
  tags: ['concurrency', 'distributed', 'snapshot', 'consistent-cut'],
  complexity: { time: 'O(e) markers', space: 'O(e)' },
  attributes: { model: '步骤序列模拟 / step-sequence simulation' },
  references: [
    {
      label: 'Chandy & Lamport (1985). Distributed Snapshots.',
      url: 'https://doi.org/10.1145/214451.214456',
    },
  ],
};
