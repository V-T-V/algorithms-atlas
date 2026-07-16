// Basic Paxos（Basic Paxos）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'conc-paxos-basic',
  categoryId: 'concurrency',
  title: { zh: 'Basic Paxos', en: 'Basic Paxos' },
  summary: { zh: '两阶段多数派达成共识。', en: 'Two-phase majority consensus.' },
  description: {
    zh: 'Basic Paxos(Lamport)通过 Prepare/Promise 与 Accept/Accepted 两阶段，在多数派 acceptor 间就单个值达成共识，是分布式共识基石。',
    en: 'Basic Paxos (Lamport) reaches consensus on a single value via Prepare/Promise and Accept/Accepted phases over a majority of acceptors.',
  },
  tags: ['concurrency', 'paxos', 'consensus', 'distributed'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
