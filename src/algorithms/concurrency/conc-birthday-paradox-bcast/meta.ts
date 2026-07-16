// Bracha 可靠广播（Bracha Reliable Broadcast）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'conc-birthday-paradox-bcast',
  categoryId: 'concurrency',
  title: { zh: 'Bracha 可靠广播', en: 'Bracha Reliable Broadcast' },
  summary: { zh: '拜占庭容错的可靠广播协议。', en: 'Byzantine-tolerant reliable broadcast.' },
  description: {
    zh: 'Bracha 协议在 n>=3f+1 节点下通过 ECHO/READY 三阶段实现拜占庭可靠广播，保证所有诚实节点收到同一消息。',
    en: 'Bracha protocol achieves Byzantine reliable broadcast in three phases (SEND/ECHO/READY) when n>=3f+1.',
  },
  tags: ['concurrency', 'byzantine', 'broadcast', 'distributed'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
