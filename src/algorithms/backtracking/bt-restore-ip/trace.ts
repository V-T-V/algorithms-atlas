import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { restoreIpAddresses } from './impl.ts';
export const DEFAULT_S = '25525511135';
export function buildTrace(s: string = DEFAULT_S): Frame[] {
  const rec = new TraceRecorder();
  const cur: string[] = [];
  rec.begin({ zh: '复原 IP "' + s + '"', en: 'Restore IP "' + s + '"' }).commit();
  restoreIpAddresses(s, {
    onSeg: (seg) => {
      cur.push(seg);
      rec
        .begin({ zh: '段 ' + seg, en: 'seg ' + seg })
        .setAux([{ label: 'cur', value: cur.join('.'), role: 'pivot' as BarRole }])
        .commit();
    },
    onResult: (ip) =>
      rec
        .begin({ zh: ip, en: ip })
        .setBars([{ value: ip.length, role: 'final' as BarRole, label: ip }])
        .commit(),
  });
  rec.begin({ zh: '完成', en: 'Done' }).commit();
  return rec.build();
}
