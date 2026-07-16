import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { countingBloomDemo } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '计数布隆 m=32 k=3', en: 'Counting bloom m=32 k=3' }).commit();
  countingBloomDemo(['a', 'b'], ['a'], ['a', 'b'], 32, 3, {
    onAdd: (it) => rec.begin({ zh: `加入 ${it}`, en: `add ${it}` }).commit(),
    onRemove: (it) => rec.begin({ zh: `删除 ${it}`, en: `remove ${it}` }).commit(),
    onQuery: (it, c) =>
      rec
        .begin({ zh: `查 ${it}: min计数${c}`, en: `query ${it}: min${c}` })
        .setBars([{ value: c, role: c > 0 ? ('final' as BarRole) : ('warn' as BarRole) }])
        .commit(),
  });
  return rec.build();
}
