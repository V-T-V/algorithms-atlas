import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { signBit } from './impl.ts';
export const DEFAULT_INPUT = [-42, -1, 0, 1, 99];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: '符号提取', en: 'Sign extraction' })
    .setArray(
      [...input],
      input.map(() => 'default' as BarRole),
      [],
    )
    .commit();
  const out: number[] = [];
  input.forEach((x, i) => {
    const r = signBit(x, { onSign: (s) => out.push(s) });
    const roles = input.map(() => 'default' as BarRole);
    roles[i] = 'pivot' as BarRole;
    rec
      .begin({ zh: 'sign(' + x + ') = ' + r, en: 'sign(' + x + ') = ' + r })
      .setArray([...input], roles, [{ index: i, label: 'i' }])
      .commit();
  });
  rec
    .begin({ zh: '结果：' + out.join(', '), en: 'Result: ' + out.join(', ') })
    .setArray(
      out,
      out.map(() => 'final' as BarRole),
      [],
    )
    .commit();
  return rec.build();
}
