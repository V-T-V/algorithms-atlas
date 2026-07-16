import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { filterBy, andSpec, type Spec } from './impl.ts';
const gt2: Spec<number> = { isSatisfiedBy: (n) => n > 2 };
const lt8: Spec<number> = { isSatisfiedBy: (n) => n < 8 };
export const DEFAULT_INPUT: any = [1, 3, 5, 9, 4];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '规约 >2 AND <8', en: 'spec' }).commit();
  const out = filterBy(input, andSpec(gt2, lt8), {
    onCheck: (i, ok) =>
      rec
        .begin({ zh: 'item ' + i, en: 'check' })
        .setAux([
          { label: 'item', value: String(i), role: 'compare' as BarRole },
          { label: 'ok', value: String(ok), role: ok ? ('final' as BarRole) : ('warn' as BarRole) },
        ])
        .commit(),
  });
  rec
    .begin({ zh: '通过 [' + out.join(',') + ']', en: 'pass' })
    .setAux([{ label: 'pass', value: out.join(','), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
