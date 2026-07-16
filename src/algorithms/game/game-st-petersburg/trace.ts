import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { stPetersburg } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: '圣彼得堡：截断到 20 轮', en: 'St. Petersburg: truncated to 20 rounds' })
    .setAux([{ label: 'maxN', value: '20', role: 'default' as BarRole }])
    .commit();
  const r = stPetersburg(20, {
    onRound: (n, prize) =>
      rec
        .begin({ zh: `第${n}轮 奖金${prize}`, en: `round${n} prize${prize}` })
        .setBars([{ value: Math.log2(prize), role: 'pivot' as BarRole, label: 'log2 prize' }])
        .commit(),
  });
  rec
    .begin({
      zh: `EV=${r.ev} 对数效用=${r.logUtil.toFixed(2)}`,
      en: `EV=${r.ev} logUtil=${r.logUtil.toFixed(2)}`,
    })
    .setAux([
      { label: 'EV', value: String(r.ev), role: 'warn' as BarRole },
      { label: '对数效用', value: r.logUtil.toFixed(2), role: 'final' as BarRole },
    ])
    .commit();
  return rec.build();
}
