import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { isPow4Bit } from './impl.ts';
export const DEFAULT_INPUT = [0, 1, 2, 4, 8, 16, 64, 256];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: '4的幂判定', en: 'Power of four check' })
    .setArray(
      [...input],
      input.map(() => 'default' as BarRole),
      [],
    )
    .commit();
  input.forEach((x, i) => {
    const r = isPow4Bit(x);
    const roles = input.map(() => 'default' as BarRole);
    roles[i] = (r ? 'final' : 'warn') as BarRole;
    rec
      .begin({ zh: 'isPow4(' + x + ')=' + r, en: 'isPow4(' + x + ')=' + r })
      .setArray([...input], roles, [{ index: i, label: 'i' }])
      .commit();
  });
  return rec.build();
}
