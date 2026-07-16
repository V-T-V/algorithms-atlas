// 命令模式 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'design-command',
  categoryId: 'design',
  title: { zh: '命令模式', en: 'Command Pattern' },
  summary: {
    zh: '命令：把请求封装成对象，支持排队、日志、撤销与宏。',
    en: 'Command: encapsulate requests as objects, enabling queuing, logging, undo, and macros.',
  },
  description: {
    zh: '命令模式（行为型）：\n\n- Command 接口：execute() / undo()。\n- Invoker 持有命令队列，按需触发。\n- Receiver 是实际执行者。\n- 支持：撤销（执行 undo 链）、宏命令（组合多个）、事务日志。\n\n本实现：遥控灯泡，支持 on/off 两个命令、撤销、宏。',
    en: 'Command Pattern (behavioral):\n\n- Command interface: execute() / undo().\n- Invoker holds the command queue and triggers as needed.\n- Receiver performs the actual work.\n- Enables undo (via undo chain), macro commands (compose many), transaction logs.\n\nThis implementation: a light remote with on/off commands, undo, and macros.',
  },
  tags: ['design', 'behavioral-pattern', 'undo', 'invoker'],
  complexity: { time: 'O(1) per command', space: 'O(history)' },
};
