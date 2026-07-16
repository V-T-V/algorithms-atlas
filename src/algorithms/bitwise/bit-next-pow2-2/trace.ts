import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { nextPow2 } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2);
export const DEFAULT_INPUT = [1, 3, 5, 9, 16, 33, 1000];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: '下一个2的幂', en: 'Next power of two' })
    .setArray(
      [...input],
      input.map(() => 'default' as BarRole),
      [],
    )
    .commit();
  const out: number[] = [];
  input.forEach((x, i) => {
    const r = nextPow2(x, {
      onFill: (f) =>
        rec
          .begin({ zh: 'filled = ' + b(f), en: 'filled = ' + b(f) })
          .setAux([{ label: 'filled', value: b(f), role: 'pivot' as BarRole }])
          .commit(),
      onResult: (v) => out.push(v),
    });
    const roles = input.map(() => 'default' as BarRole);
    roles[i] = 'final' as BarRole;
    rec
      .begin({ zh: 'nextPow2(' + x + ')=' + r, en: 'nextPow2(' + x + ')=' + r })
      .setArray([...input], roles, [{ index: i, label: 'i' }])
      .commit();
  });
  return rec.build();
}
