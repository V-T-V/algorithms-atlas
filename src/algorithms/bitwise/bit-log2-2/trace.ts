import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { floorLog2 } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3, 7, 8, 1023, 1024];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: '折半求 floor(log2)', en: 'Floor log2' })
    .setArray(
      [...input],
      input.map(() => 'default' as BarRole),
      [],
    )
    .commit();
  const out: number[] = [];
  input.forEach((x, i) => {
    const r = floorLog2(x, {
      onClz: (c) =>
        rec
          .begin({ zh: 'clz(' + x + ')=' + c, en: 'clz(' + x + ')=' + c })
          .setAux([{ label: 'clz', value: String(c), role: 'pivot' as BarRole }])
          .commit(),
      onResult: (v) => out.push(v),
    });
    const roles = input.map(() => 'default' as BarRole);
    roles[i] = 'final' as BarRole;
    rec
      .begin({ zh: 'log2(' + x + ')=' + r, en: 'log2(' + x + ')=' + r })
      .setArray([...input], roles, [{ index: i, label: 'i' }])
      .commit();
  });
  return rec.build();
}
