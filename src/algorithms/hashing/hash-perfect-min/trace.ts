import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { perfectHashBuild } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const keys = ['apple', 'banana', 'cherry', 'date'];
  rec.begin({ zh: '完美哈希构造', en: 'Perfect hash build' }).commit();
  const r = perfectHashBuild(keys, {
    onConclude: (sz) =>
      rec
        .begin({ zh: `表大小 ${sz}`, en: `table size ${sz}` })
        .setBars([{ value: sz, role: 'final' as BarRole }])
        .commit(),
  });
  void r;
  return rec.build();
}
