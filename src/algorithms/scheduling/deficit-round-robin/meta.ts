// 赤字轮转（Deficit Round Robin, DRR）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'deficit-round-robin',
  categoryId: 'scheduling',
  title: { zh: '赤字轮转（DRR）', en: 'Deficit Round Robin (DRR)' },
  summary: {
    zh: '为每个流维护赤字计数器，累加量子直到够发队首包。',
    en: 'Each flow keeps a deficit counter incremented by a quantum until it can send the head packet.',
  },
  description: {
    zh: '赤字轮转（Deficit Round Robin, DRR）是支持变长包的公平调度。每个流有一个赤字计数器 DC，每轮加上一个量子 Q：\n- 若 DC ≥ 队首包长度 L，则发送该包，DC −= L；继续尝试队首\n- 否则跳到下一流（DC 保留供下一轮累积）\n\n相比普通轮转，DRR 让「短包流」累积的赤字能在后续轮次用于发送大包，实现近似按比特的公平。\n\n时间复杂度 O(轮数 × 流数 + 总包数)。',
    en: 'Deficit Round Robin (DRR) fairly schedules variable-length packets. Each flow has a deficit counter DC incremented by a quantum Q each round; if DC >= head packet length L, send it and DC -= L, repeating; else move on, keeping DC for next round. Lets short-packet flows accumulate credit to send larger packets later, approximating bit-level fairness.',
  },
  tags: ['scheduling', 'drr', 'round-robin', 'network', 'fair-queueing'],
  complexity: { time: 'O(R·F + P)', space: 'O(P)' },
};
