// Lamport 逻辑时钟 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'lamport-clock',
  categoryId: 'concurrency',
  title: { zh: 'Lamport 逻辑时钟', en: 'Lamport Logical Clock' },
  summary: {
    zh: '为分布式事件编号：本地自增 + 收消息取 max 后 +1，建立 happens-before 偏序。',
    en: 'Numbers distributed events: increment locally, take max on receive then +1, building happens-before order.',
  },
  description: {
    zh: 'Lamport 逻辑时钟（L. Lamport, 1978）给分布式系统中的事件一个单调标号，从而定义偏序关系 「→」（happens-before）：\n\n规则：\n- 每个进程维护本地计数器 C\n- **本地事件**：C = C + 1\n- **发送消息**：C = C + 1，附带时间戳 C\n- **接收消息**（时间戳 m）：C = max(C, m) + 1\n\n性质：\n- 若 a → b（同进程先 a 后 b，或 a 发消息 b 收），则 C(a) < C(b)\n- 反向不成立（C(a) < C(b) 不蕴含 a → b），故为偏序而非全序\n- 全序需额外用进程 id 做 tie-breaker\n\n本实现用事件序列模拟多个进程的 local/send/receive，计算各自时钟值。',
    en: "Lamport's logical clock (L. Lamport, 1978) assigns monotonic timestamps to events in a distributed system, defining the happens-before partial order '→':\n\nRules:\n- Each process keeps a local counter C\n- **Local event**: C = C + 1\n- **Send**: C = C + 1, piggyback timestamp C\n- **Receive** (timestamp m): C = max(C, m) + 1\n\nProperties:\n- If a → b (same process a before b, or a sends and b receives), then C(a) < C(b)\n- The converse fails (C(a) < C(b) does not imply a → b), so it is a partial not total order\n- A total order needs a process-id tie-breaker\n\nThis implementation simulates multiple processes' local/send/receive events as a sequence.",
  },
  tags: ['concurrency', 'distributed', 'logical-clock', 'ordering'],
  complexity: { time: 'O(1) per event', space: 'O(n) for clocks' },
  attributes: { model: '事件序列模拟 / event-sequence simulation' },
  references: [
    {
      label: 'Lamport, L. (1978). Time, Clocks, and the Ordering of Events.',
      url: 'https://doi.org/10.1145/359545.359563',
    },
  ],
};
