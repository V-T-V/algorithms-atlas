import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { millerRabin } from './impl.ts';
export const DEFAULT_INPUT: any = { n: 221, witnesses: [2, 3, 5] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Miller-Rabin n=' + input.n, en: 'MR n=' + input.n }).commit();
  const prime = millerRabin(input.n, input.witnesses, {
    onWitness: (a, comp) =>
      rec
        .begin({ zh: '基 ' + a + ': ' + (comp ? '合数' : '可能素'), en: 'witness' })
        .setAux([
          { label: 'a', value: String(a), role: 'compare' as BarRole },
          {
            label: 'composite',
            value: String(comp),
            role: comp ? ('warn' as BarRole) : ('final' as BarRole),
          },
        ])
        .commit(),
  });
  rec
    .begin({ zh: prime ? '可能素数' : '合数', en: prime ? 'probable prime' : 'composite' })
    .setAux([{ label: 'result', value: prime ? 'prime' : 'composite', role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
