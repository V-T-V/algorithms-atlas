import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { onlinePagingLru } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const req = [1, 2, 3, 4, 1, 2, 5, 1, 2, 3];
  rec.begin({ zh: 'LRU 分页 cache=4', en: 'LRU paging cache=4' }).commit();
  const r = onlinePagingLru(req, 4, {
    onMiss: (p, ev) =>
      rec
        .begin({
          zh: `缺页 ${p}${ev !== undefined ? ' 淘汰' + ev : ''}`,
          en: `miss ${p}${ev !== undefined ? ' evict ' + ev : ''}`,
        })
        .setBars([{ value: p, role: 'warn' as BarRole }])
        .commit(),
    onHit: (p) =>
      rec
        .begin({ zh: `命中 ${p}`, en: `hit ${p}` })
        .setBars([{ value: p, role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: `${r.hits} 命中 ${r.misses} 缺页`, en: `${r.hits} hits ${r.misses} misses` })
    .setAux([
      { label: '命中率', value: (r.hits / req.length).toFixed(2), role: 'final' as BarRole },
    ])
    .commit();
  return rec.build();
}
