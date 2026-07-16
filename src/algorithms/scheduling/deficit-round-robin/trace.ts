// 赤字轮转（DRR）· 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { deficitRoundRobin, type DrrFlow, type DrrHooks } from './impl.ts';

export const DEFAULT_INPUT: DrrFlow[] = [
  { flow: 'A', packets: [200, 200, 200] },
  { flow: 'B', packets: [600, 200] },
  { flow: 'C', packets: [100, 100] },
];

export function buildTrace(input: DrrFlow[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const allPackets: Array<{ flow: string; len: number; id: string }> = [];
  let idx = 0;
  for (const f of input) {
    for (const len of f.packets) {
      allPackets.push({ flow: f.flow, len, id: `${f.flow}${idx++}` });
    }
  }
  const sent = new Set<string>();
  let curId: string | null = null;
  let flowBytes: Record<string, number> = {};
  for (const f of input) flowBytes[f.flow] = 0;
  let round = 0;

  const snapshot = (note: { zh: string; en: string }): void => {
    const bars = allPackets.map((p, _i) => {
      let role: BarRole = 'default';
      if (sent.has(p.id)) role = 'final';
      if (curId === p.id) role = 'swap';
      return { value: p.len, role, label: `${p.flow}:${p.len}` };
    });
    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      { label: '轮次', value: `R${round}`, role: 'pivot' as BarRole },
      { label: '已发送', value: String(sent.size), role: 'compare' as BarRole },
    ];
    for (const [f, b] of Object.entries(flowBytes)) {
      aux.push({ label: `流 ${f}`, value: String(b), role: 'frontier' as BarRole });
    }
    rec.begin(note).setBars(bars).setAux(aux).commit();
    curId = null;
  };

  snapshot({
    zh: `DRR：${allPackets.length} 包，量子 500`,
    en: `DRR: ${allPackets.length} packets, quantum 500`,
  });

  // 维护每流已发到第几个，用于映射 id
  const sentPerFlow: Record<string, number> = {};
  for (const f of input) sentPerFlow[f.flow] = 0;

  const hooks: DrrHooks = {
    onRound: (r) => {
      round = r;
      void r;
    },
    onSend: (fl, len) => {
      const k = sentPerFlow[fl] ?? 0;
      // 找到该流第 k 个包（按原始顺序）的全局 id
      let count = 0;
      for (const p of allPackets) {
        if (p.flow === fl) {
          if (count === k) {
            curId = p.id;
            sent.add(p.id);
            break;
          }
          count++;
        }
      }
      sentPerFlow[fl] = k + 1;
      void len;
      snapshot({ zh: `流 ${fl} 发送 ${len}`, en: `Flow ${fl} sends ${len}` });
    },
  };

  const result = deficitRoundRobin(input, 500, hooks);
  flowBytes = { ...result.flowBytes };

  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(
      allPackets.map((p) => ({
        value: p.len,
        role: 'final' as BarRole,
        label: `${p.flow}:${p.len}`,
      })),
    )
    .setAux([
      { label: '总轮数', value: String(result.rounds), role: 'final' as BarRole },
      { label: '总发送', value: String(result.sent.length), role: 'pivot' as BarRole },
      ...Object.entries(result.flowBytes).map(([f, b]) => ({
        label: `流 ${f}`,
        value: String(b),
        role: 'frontier' as BarRole,
      })),
    ])
    .commit();

  return rec.build();
}
