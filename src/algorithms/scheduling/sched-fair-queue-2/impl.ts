// Fair Queue v2 · 纯算法实现
// Weighted Fair Queuing：每个包的 finish time = max(prevFinish, arrival) + size/weight，按 finish 排序发送。

export interface FqPacket {
  flow: string;
  seq: number;
  arrival: number;
  size: number;
}

export interface FqWeight {
  flow: string;
  weight: number;
}

export interface FqHooks {
  onSend?: (pkt: FqPacket, finishTime: number) => void;
}

export function fairQueue(
  packets: FqPacket[],
  weights: FqWeight[],
  hooks?: FqHooks,
): { sendOrder: FqPacket[]; flowBytes: Record<string, number> } {
  const wMap = new Map<string, number>();
  for (const w of weights) wMap.set(w.flow, w.weight || 1);

  const flowBytes: Record<string, number> = {};
  const flowLastFinish = new Map<string, number>();

  for (const p of packets) {
    if (!(p.flow in flowBytes)) flowBytes[p.flow] = 0;
  }

  const withFinish = packets.map((p) => {
    const w = wMap.get(p.flow) ?? 1;
    const last = flowLastFinish.get(p.flow) ?? 0;
    const start = Math.max(last, p.arrival);
    const ft = start + p.size / w;
    flowLastFinish.set(p.flow, ft);
    return { pkt: p, finish: ft };
  });

  withFinish.sort((a, b) => a.finish - b.finish);

  const sendOrder = withFinish.map((wf) => {
    flowBytes[wf.pkt.flow] = (flowBytes[wf.pkt.flow] ?? 0) + wf.pkt.size;
    hooks?.onSend?.(wf.pkt, wf.finish);
    return wf.pkt;
  });

  return { sendOrder, flowBytes };
}
