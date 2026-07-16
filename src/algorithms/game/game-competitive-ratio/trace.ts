import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { competitiveRatio } from './impl.ts';
const ON = [10, 8, 20, 15],
  OFF = [5, 8, 4, 5];
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: '竞争比：在线 vs 离线', en: 'Competitive ratio: online vs offline' })
    .setBars(ON.map((v, i) => ({ value: v / OFF[i]!, role: 'default' as BarRole, label: 'CR' })))
    .commit();
  const r = competitiveRatio(ON, OFF, {
    onInstance: (i, on, off, ratio) =>
      rec
        .begin({
          zh: `实例${i}: ${on}/${off} = ${ratio.toFixed(2)}`,
          en: `inst${i}: ${on}/${off} = ${ratio.toFixed(2)}`,
        })
        .setAux([
          { label: '在线', value: String(on), role: 'compare' as BarRole },
          { label: '离线', value: String(off), role: 'default' as BarRole },
          { label: '比值', value: ratio.toFixed(2), role: 'pivot' as BarRole },
        ])
        .commit(),
  });
  rec
    .begin({
      zh: `最坏竞争比 ${r.maxRatio.toFixed(2)} @实例${r.idx}`,
      en: `Worst CR ${r.maxRatio.toFixed(2)} @inst${r.idx}`,
    })
    .setBars(
      ON.map((v, i) => ({
        value: v / OFF[i]!,
        role: i === r.idx ? ('final' as BarRole) : ('default' as BarRole),
      })),
    )
    .commit();
  return rec.build();
}
