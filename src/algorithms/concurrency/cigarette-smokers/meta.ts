// 抽烟者问题（Cigarette Smokers）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'cigarette-smokers',
  categoryId: 'concurrency',
  title: { zh: '抽烟者问题', en: 'Cigarette Smokers Problem' },
  summary: {
    zh: '代理放两种原料，三个抽烟者各缺一种；缺的那种的抽烟者取走并卷烟。',
    en: 'An agent places two of three ingredients; the smoker missing those two takes them and rolls a cigarette.',
  },
  description: {
    zh: '抽烟者问题（Suhas Patil 1971）：三个抽烟者各拥有无限的一种原料——烟草(T)、纸(P)、火柴(M)。一个代理随机选两种原料放到桌上，然后等待。缺这两种原料的那个抽烟者拿走它们，卷烟、抽完，然后通知代理再放下一轮。\n\n- 放 T+P → 抽烟者 3（有 M）行动\n- 放 T+M → 抽烟者 2（有 P）行动\n- 放 P+M → 抽烟者 1（有 T）行动\n\n经典实现用三个信号量（每种「双原料组合」一个），代理按选择 post 对应信号量；抽烟者各自 wait。抽完后用一个 done 信号量通知代理。\n\n注意：Patil 原文用此问题说明「单信号量无法解决某些同步」需要更原语。这里给出确定性事件序列模拟：代理放料 → 对应抽烟者取料抽烟 → 通知 → 循环。',
    en: 'The Cigarette Smokers Problem (Suhas Patil, 1971): three smokers each have an endless supply of one ingredient — tobacco (T), paper (P), matches (M). An agent repeatedly chooses two of the three ingredients, places them on the table, and waits. The smoker who lacks those two takes them, rolls and smokes a cigarette, then signals the agent to offer the next round.\n\n- Offer T+P → smoker 3 (has M) acts\n- Offer T+M → smoker 2 (has P) acts\n- Offer P+M → smoker 1 (has T) acts\n\nThe classic implementation uses three semaphores (one per two-ingredient combination); the agent posts the matching one and smokers wait on it. A "done" semaphore lets the smoker tell the agent to continue.\n\nNote: Patil used this to argue that semaphores alone cannot express certain synchronization patterns. Here we give a deterministic event-sequence simulation: agent offers → the matching smoker smokes → signals → repeat.',
  },
  tags: ['concurrency', 'synchronization', 'classic', 'semaphore'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
