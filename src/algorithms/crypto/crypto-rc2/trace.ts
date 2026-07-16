import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rc2Encrypt } from './impl.ts';
export const DEFAULT_INPUT: any = { key: [1, 2, 3, 4], block: [0x01, 0x02, 0x03, 0x04] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'RC2', en: 'RC2' }).commit();
  const ct = rc2Encrypt(input.key, input.block, {
    onRound: (r, w0, w1) =>
      rec
        .begin({ zh: '第 ' + r + ' 轮', en: 'round ' + r })
        .setAux([
          { label: 'w0', value: w0.toString(16), role: 'compare' as BarRole },
          { label: 'w1', value: w1.toString(16), role: 'final' as BarRole },
        ])
        .commit(),
  });
  rec
    .begin({ zh: '密文 [' + ct.map((b: number) => b.toString(16)).join(',') + ']', en: 'ct' })
    .setAux([{ label: 'ct', value: ct.join(','), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
