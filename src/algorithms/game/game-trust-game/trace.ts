import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { trustGame } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '信任博弈: e=10 送5 翻3倍', en: 'Trust game: e=10 send5 x3' }).commit();
  const r = trustGame(10, 5, 3, 7, {
    onPayoff: (s, t) =>
      rec
        .begin({ zh: `委托人=${s} 受托人=${t}`, en: `sender=${s} trustee=${t}` })
        .setBars([
          { value: s, role: 'final' as BarRole, label: 'sender' },
          { value: t, role: 'compare' as BarRole, label: 'trustee' },
        ])
        .commit(),
  });
  void r;
  return rec.build();
}
