// 反应器模式（Reactor）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'design-reactor',
  categoryId: 'design',
  title: { zh: '反应器模式', en: 'Reactor' },
  summary: { zh: '事件多路复用分发处理。', en: 'Event demultiplex dispatch.' },
  description: {
    zh: '反应器模式用单个事件循环多路复用 IO 事件，事件就绪时分发到对应 handler，是 Node.js、Netty、Nginx 的核心。',
    en: 'The Reactor pattern multiplexes I/O events in one event loop and dispatches ready events to handlers; core of Node.js, Netty, Nginx.',
  },
  tags: ['design', 'pattern', 'reactor', 'concurrency'],
  complexity: { time: 'O(e)', space: 'O(h)' },
};
