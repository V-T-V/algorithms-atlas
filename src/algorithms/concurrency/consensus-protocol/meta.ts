// 共识协议（Paxos 简化版）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'consensus-protocol',
  categoryId: 'concurrency',
  title: { zh: '共识协议（Paxos 简化版）', en: 'Consensus Protocol (Simplified Paxos)' },
  summary: {
    zh: 'Proposer 提议、Acceptor 投票、Learner 学习：两阶段 Prepare/Promise + Accept/Ack 选定一个值。',
    en: 'Proposer proposes, Acceptors vote, Learner learns: two phases Prepare/Promise + Accept/Ack to choose a single value.',
  },
  description: {
    zh: 'Paxos（L. Lamport, 1998）是分布式共识的经典协议，保证在多数派可用的前提下最终选定唯一值，且选定后不可改变。角色：\n\n- **Proposer**：发起提议\n- **Acceptor**：对提议投票\n- **Learner**：学习已选定值\n\n两阶段：\n1. **Prepare/Promise**：Proposer 用编号 n 发 Prepare；Acceptor 承诺不再接受 <n 的提议，并返回已接受的最大编号的值（若有）\n2. **Accept/Ack**：Proposer 收到多数 Promise 后，发 Accept(值)；Acceptor 收到后接受；多数接受则值被选定，Learner 学习\n\n关键不变量：\n- 一旦值被选定，后续任何被选定的值都相同（安全）\n- 多数派可用时终能选定（活性）\n\n本实现模拟单轮成功路径（无竞争）。',
    en: 'Paxos (L. Lamport, 1998) is the canonical distributed consensus protocol: with a live majority it eventually chooses a single value, and once chosen that value is immutable. Roles:\n\n- **Proposer**: initiates proposals\n- **Acceptor**: votes on proposals\n- **Learner**: learns the chosen value\n\nTwo phases:\n1. **Prepare/Promise**: Proposer sends Prepare with number n; Acceptor promises not to accept proposals < n and returns the highest-numbered value it has already accepted (if any)\n2. **Accept/Ack**: Proposer, after a majority of Promises, sends Accept(value); Acceptor accepts; a majority of accepts means the value is chosen and Learner learns it\n\nKey invariants:\n- Once a value is chosen, every subsequently chosen value is the same (safety)\n- With a live majority, a value is eventually chosen (liveness)\n\nThis implementation simulates a single successful run (no contention).',
  },
  tags: ['concurrency', 'distributed', 'consensus', 'paxos'],
  complexity: { time: 'O(n) messages per round', space: 'O(n)' },
  attributes: { model: '步骤序列模拟 / step-sequence simulation' },
  references: [
    {
      label: 'Lamport, L. (1998). The Part-Time Parliament.',
      url: 'https://research.microsoft.com/en-us/um/people/lamport/pubs/lamport-paxos.pdf',
    },
  ],
};
