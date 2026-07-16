import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { isPow2Bit } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2).padStart(8, '0').slice(-8);
export const DEFAULT_INPUT = [0, 1, 2, 3, 4, 16, 255, 256];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: '2的幂判定', en: 'Power of two check' })
    .setArray(
      [...input],
      input.map(() => 'default' as BarRole),
      [],
    )
    .commit();
  const out: boolean[] = [];
  input.forEach((x, i) => {
    const r = isPow2Bit(x, { onResult: (v) => out.push(v) });
    const roles = input.map(() => 'default' as BarRole);
    roles[i] = (r ? 'final' : 'warn') as BarRole;
    rec
      .begin({
        zh: b(x) + ' & ' + b((x - 1) >>> 0) + ' → ' + r,
        en: b(x) + ' & ' + b((x - 1) >>> 0) + ' → ' + r,
      })
      .setArray([...input], roles, [{ index: i, label: 'i' }])
      .commit();
  });
  return rec.build();
}
