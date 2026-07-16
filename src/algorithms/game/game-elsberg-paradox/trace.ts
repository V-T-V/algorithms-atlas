import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ellsbergAnalysis } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({
      zh: '埃尔斯伯格：30 红 + 60 黑/黄(未知)',
      en: 'Ellsberg: 30 red + 60 black/yellow(unknown)',
    })
    .setAux([
      { label: 'red', value: '30', role: 'final' as BarRole },
      { label: 'black+yellow', value: '60', role: 'warn' as BarRole },
    ])
    .commit();
  ellsbergAnalysis({
    onChoice: (s, o, w) =>
      rec
        .begin({
          zh: `场景${s} 选${o}: 概率 ${(w * 90).toFixed(0)}/90`,
          en: `scn${s} pick${o}: ${(w * 90).toFixed(0)}/90`,
        })
        .setBars([{ value: w, role: 'pivot' as BarRole, label: 'P' }])
        .commit(),
  });
  return rec.build();
}
