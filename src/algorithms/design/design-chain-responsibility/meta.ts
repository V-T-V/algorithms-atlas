// 责任链模式 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'design-chain-responsibility',
  categoryId: 'design',
  title: { zh: '责任链模式', en: 'Chain of Responsibility Pattern' },
  summary: {
    zh: '责任链：把请求沿处理器链传递，每个处理器决定处理或转给下一个。',
    en: 'Chain of Responsibility: pass a request along a handler chain; each decides to handle or forward.',
  },
  description: {
    zh: '责任链模式（行为型）：\n\n- Handler 接口：setNext / handle。\n- 每个 ConcreteHandler 决定处理请求或转给 next。\n- 发送者无需知道哪个处理器最终处理。\n- 经典应用：HTTP 中间件、事件冒泡、异常处理链、审批流。\n\n本实现：技术支持三级（L1 → L2 → L3）按问题难度升级。',
    en: 'Chain of Responsibility Pattern (behavioral):\n\n- Handler interface: setNext / handle.\n- Each ConcreteHandler decides to handle or forward to next.\n- Sender need not know which handler ultimately handles.\n- Classic uses: HTTP middleware, event bubbling, exception chains, approval workflows.\n\nThis implementation: tiered tech support (L1 → L2 → L3) escalating by difficulty.',
  },
  tags: ['design', 'behavioral-pattern', 'middleware', 'pipeline'],
  complexity: { time: 'O(chain length)', space: 'O(1)' },
};
