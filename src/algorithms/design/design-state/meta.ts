// 状态模式 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'design-state',
  categoryId: 'design',
  title: { zh: '状态模式', en: 'State Pattern' },
  summary: {
    zh: '状态：把对象的状态封装成独立类，状态切换时行为随之改变。',
    en: 'State: encapsulate object state into independent classes; behavior changes as state changes.',
  },
  description: {
    zh: '状态模式（行为型）：\n\n- Context 持有当前 State 引用。\n- 每个 State 实现 handle() 描述该状态下的行为。\n- 状态转换由 State 自身或 Context 触发。\n- 替代大量 if/switch 的状态判断。\n\n本实现：自动售货机（投币/出货/退币）三态。',
    en: 'State Pattern (behavioral):\n\n- Context holds a reference to the current State.\n- Each State implements handle() describing its behavior.\n- Transitions are triggered by State itself or Context.\n- Replaces large if/switch ladders over state.\n\nThis implementation: a vending machine with three states (coin / dispense / refund).',
  },
  tags: ['design', 'behavioral-pattern', 'fsm', 'state-machine'],
  complexity: { time: 'O(1) per event', space: 'O(1)' },
};
