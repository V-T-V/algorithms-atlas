import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { carryPropagate } from './impl.ts';
export const DEFAULT_INPUT = [2, 2, 0, 0]; // 低位在前: 2+2 产生进位
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: '进位传播', en: 'Carry propagation' })
    .setArray(
      [...input],
      input.map(() => 'default' as BarRole),
      [],
    )
    .commit();
  const out = carryPropagate(input, {
    onCarry: (i, bit) => {
      const roles = input.map(() => 'default' as BarRole);
      roles[i] = 'swap' as BarRole;
      rec
        .begin({ zh: '位 ' + i + ' 进位', en: 'carry at ' + i })
        .setArray([...input], roles, [{ index: i, label: 'i' }])
        .commit();
    },
  });
  rec
    .begin({ zh: '结果：' + out.join(''), en: 'result: ' + out.join('') })
    .setArray(
      [...out],
      out.map(() => 'final' as BarRole),
      [],
    )
    .commit();
  return rec.build();
}
