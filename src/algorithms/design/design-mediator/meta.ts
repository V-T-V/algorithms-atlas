// 中介者模式 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'design-mediator',
  categoryId: 'design',
  title: { zh: '中介者模式', en: 'Mediator Pattern' },
  summary: {
    zh: '中介者：用一个中心对象封装一组对象间的交互，避免网状依赖。',
    en: 'Mediator: a central object encapsulates interactions among a group, avoiding N-N coupling.',
  },
  description: {
    zh: '中介者模式（行为型）：\n\n- Mediator 接口：notify(sender, event)。\n- Colleague 只与 Mediator 通信，不知其他 Colleague。\n- 把多对多依赖转为一对一。\n- 经典应用：聊天室、机场塔台、对话框控件协调、MVC 的 Controller。\n\n本实现：聊天室中介者 + 多个用户。',
    en: 'Mediator Pattern (behavioral):\n\n- Mediator interface: notify(sender, event).\n- Colleague only talks to the Mediator, unaware of other Colleagues.\n- Replaces N-N coupling with N-1.\n- Classic uses: chat rooms, airport towers, dialog widget coordination, MVC Controllers.\n\nThis implementation: a chat-room mediator with multiple users.',
  },
  tags: ['design', 'behavioral-pattern', 'decoupling', 'hub'],
  complexity: { time: 'O(colleagues) per event', space: 'O(colleagues)' },
};
