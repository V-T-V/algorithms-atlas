// 代理中介模式（Broker）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'design-broker',
  categoryId: 'design',
  title: { zh: '代理中介模式', en: 'Broker' },
  summary: { zh: '中介协调解耦的组件通信。', en: 'Broker coordinates decoupled components.' },
  description: {
    zh: '代理中介模式让客户端通过 broker 找到并调用远程/解耦服务，broker 负责寻址、消息转发，常见于消息中间件、微服务网格。',
    en: 'The Broker pattern lets clients locate and invoke decoupled services via a broker that handles addressing and message forwarding (message middleware, service mesh).',
  },
  tags: ['design', 'pattern', 'broker', 'architectural'],
  complexity: { time: 'O(1)', space: 'O(s)' },
};
