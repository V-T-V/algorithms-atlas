import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { canMeasureWater } from './impl.ts';
export const DEFAULT_INPUT = { jug1: 3, jug2: 5, target: 4 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: '水壶 ' + input.jug1 + '/' + input.jug2 + ' 量 ' + input.target, en: 'Jugs' })
    .commit();
  const ok = canMeasureWater(input.jug1, input.jug2, input.target, {
    onGcd: (g) =>
      rec
        .begin({ zh: 'gcd = ' + g, en: 'gcd = ' + g })
        .setAux([{ label: 'gcd', value: String(g), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '能量出？' + ok, en: 'measure? ' + ok })
    .setAux([{ label: 'ok', value: String(ok), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
