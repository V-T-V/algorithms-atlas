import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bakeryLock } from './impl.ts';
export const DEFAULT_INPUT = 3;
export function buildTrace(n: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '面包店 n=' + n, en: 'Bakery n=' + n }).commit();
  const { nums } = bakeryLock(n, {
    onChoose: (p, num) =>
      rec
        .begin({ zh: 'P' + p + ' 取号 ' + num, en: 'choose' })
        .setAux([
          { label: 'pid', value: 'P' + p, role: 'compare' as BarRole },
          { label: 'num', value: String(num), role: 'pivot' as BarRole },
        ])
        .commit(),
    onEnter: (p) =>
      rec
        .begin({ zh: 'P' + p + ' 进入', en: 'enter' })
        .setAux([{ label: 'enter', value: 'P' + p, role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '结束 nums=[' + nums.join(',') + ']', en: 'done' })
    .setAux([{ label: 'nums', value: nums.join(','), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
