// =============================================================================
// Lamport 逻辑时钟 · 纯算法实现（事件序列模拟）
// 多个进程各维护一个本地时钟 C[p]。事件类型：
//   local   : C[p]++
//   send    : C[p]++，发出消息带时间戳 C[p]，由接收方读取
//   receive : C[p] = max(C[p], msgTs) + 1
// 发送/接收用 msgId 关联，发送时记录时间戳，接收时按 msgId 取。
// =============================================================================

/** 事件类型。 */
export type LamportEventType = 'local' | 'send' | 'receive';

/** 单个事件。 */
export interface LamportEvent {
  /** 进程 id。 */
  proc: number;
  type: LamportEventType;
  /** send/receive 关联的消息 id（receive 用来取发送方时间戳）。 */
  msgId?: string;
}

/** 事件钩子。 */
export interface LamportHooks {
  onTick?: (
    proc: number,
    type: LamportEventType,
    newClock: number,
    msgId?: string,
    sentTs?: number,
  ) => void;
}

/** 事件结果（带计算后的时钟）。 */
export interface LamportEventResult {
  event: LamportEvent;
  clock: number;
  /** 接收事件对应的发送时间戳（若适用）。 */
  sentTs?: number;
}

/**
 * 按事件序列推进 Lamport 时钟模拟。
 * @param nProc 进程数
 * @param events 事件序列（send 必须在对应 receive 之前）
 * @returns 每个事件后的时钟值
 */
export function simulateLamport(
  nProc: number,
  events: LamportEvent[],
  hooks: LamportHooks = {},
): { clocks: number[]; results: LamportEventResult[] } {
  const clocks = new Array<number>(nProc).fill(0);
  const sentTimestamps = new Map<string, { proc: number; ts: number }>();
  const results: LamportEventResult[] = [];

  for (const ev of events) {
    const p = ev.proc;
    if (ev.type === 'local') {
      clocks[p] = clocks[p]! + 1;
      results.push({ event: ev, clock: clocks[p]! });
      hooks.onTick?.(p, 'local', clocks[p]!);
    } else if (ev.type === 'send') {
      clocks[p] = clocks[p]! + 1;
      const mid = ev.msgId!;
      sentTimestamps.set(mid, { proc: p, ts: clocks[p]! });
      results.push({ event: ev, clock: clocks[p]! });
      hooks.onTick?.(p, 'send', clocks[p]!, mid, clocks[p]);
    } else {
      // receive
      const mid = ev.msgId!;
      const sent = sentTimestamps.get(mid);
      const m = sent ? sent.ts : 0;
      clocks[p] = Math.max(clocks[p]!, m) + 1;
      results.push({ event: ev, clock: clocks[p]!, sentTs: m });
      hooks.onTick?.(p, 'receive', clocks[p]!, mid, m);
    }
  }

  return { clocks, results };
}
