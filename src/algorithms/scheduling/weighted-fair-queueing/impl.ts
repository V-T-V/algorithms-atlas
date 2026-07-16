// 加权公平排队（WFQ）· 纯算法实现
// 简化：所有包 t=0 到达，按虚拟完成时间 FN 升序输出。

export interface WfqPacket {
  id: string;
  flow: string;
  length: number; // 包长 L
}

export interface WfqFlow {
  flow: string;
  weight: number; // 权重 w（>0）
}

export interface WfqScheduled extends WfqPacket {
  virtualStart: number;
  virtualFinish: number;
  /** 实际发送顺序（0-based）。 */
  sendOrder: number;
  /** 累计已发送字节的开始时刻（实际时间近似）。 */
  startTime: number;
  finishTime: number;
}

export interface WfqResult {
  schedule: WfqScheduled[];
  /** 每个流的实际发送字节数。 */
  flowBytes: Record<string, number>;
  totalTime: number;
}

/** 事件钩子。 */
export interface WfqHooks {
  /** 计算某包的虚拟完成时间。 */
  onComputeFinish?: (packet: WfqPacket, sn: number, fn: number) => void;
  /** 选择某包发送（给出其 FN 与发送顺序）。 */
  onSend?: (sched: WfqScheduled) => void;
  /** 完成。 */
  onResult?: (result: WfqResult) => void;
}

/**
 * 加权公平排队（所有包 t=0 到达的简化版）。
 *
 * @param packets 包列表
 * @param flows 流权重列表
 * @param hooks 可选事件钩子
 */
export function weightedFairQueueing(
  packets: readonly WfqPacket[],
  flows: readonly WfqFlow[],
  hooks: WfqHooks = {},
): WfqResult {
  if (packets.length === 0) return { schedule: [], flowBytes: {}, totalTime: 0 };

  const weightMap = new Map<string, number>();
  for (const f of flows) weightMap.set(f.flow, f.weight);
  // 缺省权重 1
  const usedFlows = new Set(packets.map((p) => p.flow));
  for (const fl of usedFlows) if (!weightMap.has(fl)) weightMap.set(fl, 1);

  // 每个流上一包的 FN（虚拟完成）
  const lastFinish = new Map<string, number>();
  for (const fl of usedFlows) lastFinish.set(fl, 0);

  // 计算每个包的 SN、FN
  const computed = packets.map((p) => {
    const w = weightMap.get(p.flow) ?? 1;
    const sn = lastFinish.get(p.flow) ?? 0;
    const fn = sn + p.length / w;
    lastFinish.set(p.flow, fn);
    hooks.onComputeFinish?.(p, sn, fn);
    return { packet: p, virtualStart: sn, virtualFinish: fn };
  });

  // 按 FN 升序（平局按原顺序）发送
  computed.sort((a, b) => a.virtualFinish - b.virtualFinish);

  let realTime = 0;
  const flowBytes: Record<string, number> = {};
  for (const fl of usedFlows) flowBytes[fl] = 0;

  const schedule: WfqScheduled[] = computed.map((c, idx) => {
    const start = realTime;
    realTime += c.packet.length;
    flowBytes[c.packet.flow] = (flowBytes[c.packet.flow] ?? 0) + c.packet.length;
    const s: WfqScheduled = {
      ...c.packet,
      virtualStart: c.virtualStart,
      virtualFinish: c.virtualFinish,
      sendOrder: idx,
      startTime: start,
      finishTime: realTime,
    };
    hooks.onSend?.(s);
    return s;
  });

  const result: WfqResult = { schedule, flowBytes, totalTime: realTime };
  hooks.onResult?.(result);
  return result;
}
