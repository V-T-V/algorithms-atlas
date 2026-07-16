// 掩码绝对值 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { absMask } from './impl.ts';
export const DEFAULT_INPUT = [-7, -1, 0, 5, -256];
const b = (n: number): string => (n >>> 0).toString(2).padStart(8, '0').slice(-8);
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: '掩码绝对值', en: 'Masked abs' })
    .setArray(
      [...input],
      input.map(() => 'default' as BarRole),
      [],
    )
    .commit();
  const out: number[] = [];
  for (const x of input) {
    absMask(x, {
      onMask: (m) =>
        rec
          .begin({ zh: 'mask = ' + b(m), en: 'mask = ' + b(m) })
          .setAux([{ label: 'mask', value: b(m), role: 'pivot' as BarRole }])
          .commit(),
      onResult: (r) => out.push(r),
    });
    rec
      .begin({ zh: '|' + x + '| = ' + Math.abs(x | 0), en: '|' + x + '| = ' + Math.abs(x | 0) })
      .setAux([{ label: '结果', value: String(Math.abs(x | 0)), role: 'final' as BarRole }])
      .commit();
  }
  rec
    .begin({ zh: '完成：' + out.join(', '), en: 'Done: ' + out.join(', ') })
    .setArray(
      out,
      out.map(() => 'final' as BarRole),
      [],
    )
    .commit();
  return rec.build();
}
