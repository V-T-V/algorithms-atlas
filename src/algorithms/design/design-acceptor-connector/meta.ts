// 接受器-连接器（Acceptor-Connector）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'design-acceptor-connector',
  categoryId: 'design',
  title: { zh: '接受器-连接器', en: 'Acceptor-Connector' },
  summary: { zh: '分离被动接受与主动连接。', en: 'Separate passive accept from active connect.' },
  description: {
    zh: '接受器-连接器模式把被动监听连接(acceptor)与主动发起连接(connector)解耦，连接建立后由二者初始化 service handler。',
    en: 'The Acceptor-Connector pattern decouples passive connection acceptance from active connection initiation; both set up a service handler after connect.',
  },
  tags: ['design', 'pattern', 'acceptor-connector', 'concurrency'],
  complexity: { time: 'O(1)', space: 'O(n)' },
};
