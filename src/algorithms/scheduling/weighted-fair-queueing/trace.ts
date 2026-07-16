// 加权公平排队（WFQ）· 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { weightedFairQueueing, type WfqHooks, type WfqPacket, type WfqFlow } from './impl.ts';

export const DEFAULT_INPUT = {
  packets: [
    { id: 'a1', flow: 'A', length: 2 },
    { id: 'a2', flow: 'A', length: 2 },
    { id: 'b1', flow: 'B', length: 2 },
    { id: 'b2', flow: 'B', length: 2 },
    { id: 'c1', flow: 'C', length: 2 },
  ],
  flows: [
    { flow: 'A', weight: 2 },
    { flow: 'B', weight: 1 },
    { flow: 'C', weight: 1 },
  ],
};

export function buildTrace(
  input: { packets: WfqPacket[]; flows: WfqFlow[] } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  let sent: string[] = [];
  let curSend: string | null = null;
  let flowBytes: Record<string, number> = {};

  const snapshot = (note: { zh: string; en: string }): void => {
    const bars = input.packets.map((p) => {
      let role: BarRole = 'default';
      if (sent.includes(p.id)) role = 'final';
      if (curSend === p.id) role = 'swap';
      return { value: p.length, role, label: `${p.id}(${p.flow})` };
    });
    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      { label: '已发送', value: sent.join('→') || '∅', role: 'frontier' as BarRole },
    ];
    for (const [f, b] of Object.entries(flowBytes)) {
      aux.push({ label: `流 ${f} 字节`, value: String(b), role: 'pivot' as BarRole });
    }
    rec.begin(note).setBars(bars).setAux(aux).commit();
    curSend = null;
  };

  snapshot({
    zh: `${input.packets.length} 包，3 流`,
    en: `${input.packets.length} packets, 3 flows`,
  });

  const hooks: WfqHooks = {
    onSend: (s) => {
      curSend = s.id;
      sent.push(s.id);
      for (const f of Object.keys(flowBytes)) flowBytes[f] = 0;
      void flowBytes;
      snapshot({
        zh: `发送 ${s.id}（流 ${s.flow}, FN=${s.virtualFinish.toFixed(2)}）`,
        en: `Send ${s.id} (flow ${s.flow}, FN=${s.virtualFinish.toFixed(2)})`,
      });
    },
  };

  const result = weightedFairQueueing(input.packets, input.flows, hooks);
  flowBytes = { ...result.flowBytes };
  sent = result.schedule.map((s) => s.id);

  rec
    .begin({ zh: `发送完成`, en: `Send complete` })
    .setBars(
      input.packets.map((p) => ({
        value: p.length,
        role: 'final' as BarRole,
        label: `${p.id}(${p.flow})`,
      })),
    )
    .setAux([
      { label: '总时间', value: String(result.totalTime), role: 'final' as BarRole },
      {
        label: '顺序',
        value: result.schedule.map((s) => s.id).join('→'),
        role: 'pivot' as BarRole,
      },
      ...Object.entries(result.flowBytes).map(([f, b]) => ({
        label: `流 ${f} 字节`,
        value: String(b),
        role: 'frontier' as BarRole,
      })),
    ])
    .commit();

  return rec.build();
}
