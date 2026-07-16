import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { popcountTbl } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2).padStart(8, '0').slice(-8);
export const DEFAULT_INPUT = [7, 255, 256, 0x10101010, 0xffffffff];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: '查表 popcount', en: 'Popcount lookup' })
    .setArray(
      [...input],
      input.map(() => 'default' as BarRole),
      [],
    )
    .commit();
  const out: number[] = [];
  input.forEach((x, i) => {
    const r = popcountTbl(x, { onResult: (v) => out.push(v) });
    const roles = input.map(() => 'default' as BarRole);
    roles[i] = 'final' as BarRole;
    rec
      .begin({ zh: 'popcount(' + b(x) + ')=' + r, en: 'popcount(' + b(x) + ')=' + r })
      .setArray([...input], roles, [{ index: i, label: 'i' }])
      .commit();
  });
  return rec.build();
}
