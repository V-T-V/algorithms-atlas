import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rabinKarpRolling } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const s = 'ABABAB',
    m = 3;
  rec.begin({ zh: `滚动哈希 "${s}" m=${m}`, en: `Rolling hash "${s}" m=${m}` }).commit();
  rabinKarpRolling(s, m, {
    onWindow: (st, h) =>
      rec
        .begin({ zh: `${s.slice(st, st + m)}: ${h}`, en: `${s.slice(st, st + m)}: ${h}` })
        .setBars([{ value: h % 100, role: 'pivot' as BarRole }])
        .commit(),
  });
  return rec.build();
}
