import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { secureDice } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: '安全骰子：枚举阈值 m', en: 'Secure dice: enumerate threshold m' })
    .setAux([{ label: 'faces', value: '6', role: 'default' as BarRole }])
    .commit();
  const preview = secureDice();
  const r = secureDice({
    onThreshold: (m, ev) =>
      rec
        .begin({ zh: `m=${m} 期望=${ev.toFixed(3)}`, en: `m=${m} EV=${ev.toFixed(3)}` })
        .setBars([
          {
            value: ev,
            role: m === preview.bestM ? ('final' as BarRole) : ('default' as BarRole),
            label: 'EV',
          },
        ])
        .commit(),
  });
  rec
    .begin({
      zh: `最优 m=${r.bestM} EV=${r.bestEv.toFixed(3)}`,
      en: `best m=${r.bestM} EV=${r.bestEv.toFixed(3)}`,
    })
    .setAux([
      { label: '最优 m', value: String(r.bestM), role: 'final' as BarRole },
      { label: 'EV', value: r.bestEv.toFixed(3), role: 'final' as BarRole },
    ])
    .commit();
  return rec.build();
}
