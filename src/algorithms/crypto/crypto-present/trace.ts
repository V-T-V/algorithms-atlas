import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { presentEncrypt } from './impl.ts';
export const DEFAULT_INPUT: any = {
  key: [0x01, 0x02, 0x03, 0x04],
  block: [0x01, 0x02, 0x03, 0x04],
};
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'PRESENT', en: 'PRESENT' }).commit();
  const ct = presentEncrypt(input.key, input.block, {
    onRound: (r, st) =>
      rec
        .begin({ zh: '第 ' + r + ' 轮', en: 'round ' + r })
        .setAux([{ label: 'state', value: st.toString(16), role: 'compare' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: ct.length + ' 字节', en: ct.length + 'B' })
    .setAux([{ label: 'bytes', value: String(ct.length), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
