// 备忘录模式 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'design-memento',
  categoryId: 'design',
  title: { zh: '备忘录模式', en: 'Memento Pattern' },
  summary: {
    zh: '备忘录：在不破坏封装的前提下捕获对象内部状态，以便日后恢复（撤销）。',
    en: 'Memento: capture object internal state without breaking encapsulation, for later restoration (undo).',
  },
  description: {
    zh: '备忘录模式（行为型）：\n\n- Originator 创建 Memento 保存自己的内部状态。\n- Caretaker 持有 Memento 但不读其内容。\n- 需要时 Originator.restore(memento) 恢复。\n- 经典应用：编辑器撤销栈、事务回滚、游戏存档。\n\n本实现：文本编辑器，支持多步 undo。',
    en: 'Memento Pattern (behavioral):\n\n- Originator creates a Memento holding its internal state.\n- Caretaker keeps the Memento but never inspects it.\n- On demand Originator.restore(memento) reverts.\n- Classic uses: editor undo stacks, transaction rollback, game saves.\n\nThis implementation: a text editor with multi-step undo.',
  },
  tags: ['design', 'behavioral-pattern', 'undo', 'state-capture'],
  complexity: { time: 'O(1) save/restore', space: 'O(history)' },
};
