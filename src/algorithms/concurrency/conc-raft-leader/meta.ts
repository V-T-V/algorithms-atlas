// Raft 选主（Raft Leader Election）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'conc-raft-leader',
  categoryId: 'concurrency',
  title: { zh: 'Raft 选主', en: 'Raft Leader Election' },
  summary: { zh: '任期+多数票选出领导者。', en: 'Term + majority vote elects leader.' },
  description: {
    zh: 'Raft 选主:候选者自增任期并向其它节点请求投票，获得多数即成为领导者，心跳维持权威，比 Paxos 更易理解。',
    en: 'Raft leader election: a candidate increments its term and requests votes; a majority makes it leader, maintained by heartbeats.',
  },
  tags: ['concurrency', 'raft', 'consensus', 'election'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
