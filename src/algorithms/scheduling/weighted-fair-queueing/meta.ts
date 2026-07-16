// 加权公平排队（WFQ）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'weighted-fair-queueing',
  categoryId: 'scheduling',
  title: { zh: '加权公平排队（WFQ）', en: 'Weighted Fair Queueing (WFQ)' },
  summary: {
    zh: '为每个流按权重计算虚拟完成时间，按其升序服务。',
    en: 'Compute a virtual finish time per flow by weight and serve in ascending order.',
  },
  description: {
    zh: '加权公平排队（Weighted Fair Queueing, WFQ）是包级公平调度的经典算法。维护一个虚拟时间 V，每个到达的包计算其虚拟开始/完成时间：\n- 虚拟开始 SN = max(V, 上一包 FN)\n- 虚拟完成 FN = SN + L / w （L=包长，w=流权重）\n\n调度器总是选当前已到达包中 FN 最小者发送。结果使各流按权重比例获得带宽。\n\n本实现简化：所有包 t=0 到达，按 FN 升序输出发送顺序。',
    en: 'Weighted Fair Queueing (WFQ) is a packet-level fair scheduler. Maintain a virtual time V; each packet gets virtual start SN = max(V, prev FN) and virtual finish FN = SN + L/w (L=length, w=flow weight). The scheduler always sends the arrived packet with the smallest FN. This implementation assumes all packets arrive at t=0 and outputs them in ascending FN order.',
  },
  tags: ['scheduling', 'wfq', 'fair-queueing', 'network'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
