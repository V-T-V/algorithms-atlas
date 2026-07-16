// 赤字轮转（DRR）· 纯算法实现

export interface DrrFlow {
  flow: string;
  packets: number[]; // 队列：每个包的长度（队首在前）
}

export interface DrrSent {
  flow: string;
  length: number;
  /** 发送顺序（0-based）。 */
  order: number;
  /** 发送时该流的赤字计数器值（发送后）。 */
  deficitAfter: number;
}

export interface DrrResult {
  sent: DrrSent[];
  /** 每流发送字节数。 */
  flowBytes: Record<string, number>;
  /** 总轮数。 */
  rounds: number;
}

/** 事件钩子。 */
export interface DrrHooks {
  /** 每轮开始，各流加量子（给出轮号）。 */
  onRound?: (round: number) => void;
  /** 某流赤字不足，跳过（给出当前 DC 与队首长度）。 */
  onSkip?: (flow: string, deficit: number, headLen: number) => void;
  /** 某流发送一个包（给出长度与发送后赤字）。 */
  onSend?: (flow: string, length: number, deficitAfter: number, order: number) => void;
}

/**
 * 赤字轮转调度。
 *
 * @param flows 各流的包队列
 * @param quantum 每轮每流的赤字增量（默认 500）
 * @param hooks 可选事件钩子
 */
export function deficitRoundRobin(
  flows: readonly DrrFlow[],
  quantum: number = 500,
  hooks: DrrHooks = {},
): DrrResult {
  // 工作副本：每流的队列与赤字
  const queues = new Map<string, number[]>();
  const deficit = new Map<string, number>();
  for (const f of flows) {
    queues.set(f.flow, [...f.packets]);
    deficit.set(f.flow, 0);
  }
  const flowOrder = flows.map((f) => f.flow);

  const sent: DrrSent[] = [];
  const flowBytes: Record<string, number> = {};
  for (const fl of flowOrder) flowBytes[fl] = 0;
  let rounds = 0;

  let anyActive = true;
  while (anyActive) {
    anyActive = false;
    rounds++;
    hooks.onRound?.(rounds);
    for (const fl of flowOrder) {
      const q = queues.get(fl)!;
      if (q.length === 0) continue;
      // 加量子
      deficit.set(fl, (deficit.get(fl) ?? 0) + quantum);
      anyActive = true;
      // 尽量多发
      while (q.length > 0) {
        const dc = deficit.get(fl) ?? 0;
        const head = q[0]!;
        if (dc >= head) {
          deficit.set(fl, dc - head);
          q.shift();
          flowBytes[fl] = (flowBytes[fl] ?? 0) + head;
          const s: DrrSent = {
            flow: fl,
            length: head,
            order: sent.length,
            deficitAfter: deficit.get(fl) ?? 0,
          };
          sent.push(s);
          hooks.onSend?.(fl, head, s.deficitAfter, s.order);
        } else {
          hooks.onSkip?.(fl, dc, head);
          break;
        }
      }
    }
    // 全空则停
    if (!anyActive) break;
    if (rounds > 100000) break; // 安全阀
  }

  return { sent, flowBytes, rounds };
}
