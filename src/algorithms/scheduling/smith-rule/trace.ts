// Smith 规则（WSPT）· 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { smithRule, type SrHooks, type SrJob } from './impl.ts';

export const DEFAULT_INPUT: SrJob[] = [
  { id: 'J1', processing: 3, weight: 2 },
  { id: 'J2', processing: 4, weight: 4 },
  { id: 'J3', processing: 2, weight: 1 },
  { id: 'J4', processing: 5, weight: 5 },
];

export function buildTrace(input: SrJob[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const done: Array<{ id: string; start: number; finish: number }> = [];
  let curSeg: { id: string; start: number; finish: number } | null = null;
  let runTotal = 0;

  const snapshot = (note: { zh: string; en: string }): void => {
    const bars = done.map((d) => ({
      value: d.finish - d.start,
      role: 'final' as BarRole,
      label: `${d.id}[${d.start}-${d.finish}]`,
    }));
    if (curSeg) {
      bars.push({
        value: curSeg.finish - curSeg.start,
        role: 'swap' as BarRole,
        label: `${curSeg.id}[${curSeg.start}-${curSeg.finish}]`,
      });
    }
    rec
      .begin(note)
      .setBars(bars)
      .setAux([
        { label: 'ΣwjCj', value: String(runTotal), role: 'pivot' as BarRole },
        {
          label: '顺序',
          value: done.map((d) => d.id).join('→') || '∅',
          role: 'frontier' as BarRole,
        },
      ])
      .commit();
    curSeg = null;
  };

  snapshot({ zh: `WSPT：${input.length} 作业`, en: `WSPT: ${input.length} jobs` });

  // 预跑得到顺序与时间
  const pre = smithRule(input);
  const order = pre.order;

  const hooks: SrHooks = {
    onSort: (o, ratios) => {
      snapshot({
        zh: `排序（按 w/p 降序）：${o.join('→')}`,
        en: `Sorted (by w/p desc): ${o.join('→')}`,
      });
      void ratios;
    },
    onComplete: (s) => {
      // 重建段：从 cursor 累加
      void s;
    },
  };

  // 用预跑结果按顺序构造段
  const result = smithRule(input, hooks);
  let t = 0;
  for (const id of order) {
    const job = input.find((j) => j.id === id)!;
    const seg = { id, start: t, finish: t + job.processing };
    t += job.processing;
    done.push(seg);
    runTotal = job.weight * t;
    curSeg = seg;
    snapshot({ zh: `${id} 完工 @${t}（wC=${runTotal}）`, en: `${id} done @${t} (wC=${runTotal})` });
  }
  curSeg = null;

  rec
    .begin({
      zh: `完成：ΣwjCj=${result.totalWeightedCompletion}`,
      en: `Done: ΣwjCj=${result.totalWeightedCompletion}`,
    })
    .setBars(
      done.map((d) => ({
        value: d.finish - d.start,
        role: 'final' as BarRole,
        label: `${d.id}[${d.start}-${d.finish}]`,
      })),
    )
    .setAux([
      { label: 'ΣwjCj', value: String(result.totalWeightedCompletion), role: 'final' as BarRole },
      { label: '顺序', value: result.order.join('→'), role: 'pivot' as BarRole },
    ])
    .commit();

  return rec.build();
}
