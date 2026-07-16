import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ctz32 } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2).padStart(8, '0').slice(-8);
export const DEFAULT_INPUT = [1, 2, 4, 8, 12, 0x10000, 0x80000000];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: '末尾零计数', en: 'Count trailing zeros' })
    .setArray(
      [...input],
      input.map(() => 'default' as BarRole),
      [],
    )
    .commit();
  const out: number[] = [];
  input.forEach((x, i) => {
    const r = ctz32(x, {
      onIsolate: (iso) =>
        rec
          .begin({ zh: 'isolate = ' + b(iso), en: 'isolate = ' + b(iso) })
          .setAux([{ label: 'isolate', value: b(iso), role: 'pivot' as BarRole }])
          .commit(),
      onResult: (v) => out.push(v),
    });
    const roles = input.map(() => 'default' as BarRole);
    roles[i] = 'final' as BarRole;
    rec
      .begin({ zh: 'ctz(' + x + ')=' + r, en: 'ctz(' + x + ')=' + r })
      .setArray([...input], roles, [{ index: i, label: 'i' }])
      .commit();
  });
  return rec.build();
}
