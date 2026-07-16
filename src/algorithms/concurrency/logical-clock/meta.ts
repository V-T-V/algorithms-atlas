// 逻辑时钟（通用框架）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'logical-clock',
  categoryId: 'concurrency',
  title: { zh: '逻辑时钟（通用框架）', en: 'Logical Clock (General Framework)' },
  summary: {
    zh: '用统一接口刻画事件序：规则化本地/发送/接收三类事件，衍生 Lamport、向量时钟等实例。',
    en: 'A uniform framework for event ordering: rule-based local/send/receive, deriving Lamport and vector clocks as instances.',
  },
  description: {
    zh: '逻辑时钟是把「时间」从物理时钟抽象为「事件因果序」的一族机制。其通用形态：\n\n- 每个进程维护一个时钟状态 C\n- 三类事件触发时钟更新规则：\n  - **local**：apply(C)\n  - **send**：apply(C)；把 C 附在消息上发出\n  - **receive**：merge(C, 消息中的时钟)；apply(C)\n\n不同 apply/merge 规则衍生不同实例：\n- **Lamport**：C 为标量；apply = C+1；merge = max\n- **向量时钟**：C 为 n 维向量；apply = C[p]++；merge = 逐维 max\n- **区间时钟**：C 为区间，可表达「可能并发」\n\n本实现以一个泛型 framework 演示规则化时钟更新，默认实例化为 Lamport 标量时钟，并对比向量时钟的并发检测能力。',
    en: 'Logical clocks abstract "time" from physical clocks into "causal order of events". The general form:\n\n- Each process maintains a clock state C\n- Three event kinds drive update rules:\n  - **local**: apply(C)\n  - **send**: apply(C); attach C to the message\n  - **receive**: merge(C, message clock); apply(C)\n\nDifferent apply/merge rules yield different instances:\n- **Lamport**: C is a scalar; apply = C+1; merge = max\n- **Vector clock**: C is an n-dim vector; apply = C[p]++; merge = per-dim max\n- **Interval clock**: C is an interval, expressing "possibly concurrent"\n\nThis implementation provides a generic framework for rule-based clock updates, defaulting to a Lamport scalar instance, and contrasts with vector-clock concurrency detection.',
  },
  tags: ['concurrency', 'distributed', 'logical-clock', 'framework'],
  complexity: { time: 'O(1) per event (scalar)', space: 'O(n) per process' },
  attributes: { model: '事件序列模拟 / event-sequence simulation' },
};
