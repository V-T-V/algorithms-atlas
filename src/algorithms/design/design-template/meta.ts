// 模板方法模式 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'design-template',
  categoryId: 'design',
  title: { zh: '模板方法模式', en: 'Template Method Pattern' },
  summary: {
    zh: '模板方法：在基类定义算法骨架，把某些步骤延迟到子类实现。',
    en: 'Template Method: define algorithm skeleton in base class, deferring some steps to subclasses.',
  },
  description: {
    zh: '模板方法模式（行为型）：\n\n- 基类用 final 方法定义流程：step1 → step2 → step3。\n- 抽象步骤（primitive）由子类实现。\n- 钩子方法可选覆盖。\n- 控制“做什么”的顺序，开放“怎么做”的细节。\n\n本实现：数据处理管道（读取 → 解析 → 输出），CSV/JSON 两个子类。',
    en: 'Template Method Pattern (behavioral):\n\n- Base class defines the flow in a final method: step1 → step2 → step3.\n- Primitive steps are abstract, implemented by subclasses.\n- Hook methods may be overridden optionally.\n- Inverts the “what” vs “how” boundary.\n\nThis implementation: a data pipeline (read → parse → output) with CSV/JSON subclasses.',
  },
  tags: ['design', 'behavioral-pattern', 'inheritance', 'pipeline'],
  complexity: { time: 'O(steps)', space: 'O(output)' },
};
