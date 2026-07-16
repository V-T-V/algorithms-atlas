import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { cuckooInsert } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const keys = ['a', 'b', 'c', 'd', 'e'];
  const h1 = (k: string) => k.charCodeAt(0) * 7;
  const h2 = (k: string) => k.charCodeAt(0) * 13;
  rec.begin({ zh: '布谷鸟插入', en: 'Cuckoo insert' }).commit();
  const ok = cuckooInsert(keys, h1, h2, {
    onInsert: (k, s) =>
      rec
        .begin({ zh: `${k} -> slot${s}`, en: `${k} -> slot${s}` })
        .setBars([{ value: s, role: 'final' as BarRole }])
        .commit(),
    onEvict: (k, f, t) =>
      rec
        .begin({ zh: `踢出 ${k}: ${f}->${t}`, en: `evict ${k}: ${f}->${t}` })
        .setBars([{ value: t, role: 'warn' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: ok ? '成功' : '失败', en: ok ? 'success' : 'fail' })
    .setAux([
      {
        label: 'result',
        value: ok ? 'OK' : 'FAIL',
        role: ok ? ('final' as BarRole) : ('warn' as BarRole),
      },
    ])
    .commit();
  return rec.build();
}
