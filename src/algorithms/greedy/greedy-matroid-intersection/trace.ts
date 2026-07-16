import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { matroidIntersection } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const E: ReadonlyArray<readonly [number, number]> = [
    [0, 1],
    [1, 2],
    [2, 3],
    [0, 2],
  ];
  rec
    .begin({ zh: '拟阵交 (森林 ∩ 匹配)', en: 'Matroid intersection (forest ∩ matching)' })
    .commit();
  const S = matroidIntersection(E, {
    onAugment: (s, ad) =>
      rec
        .begin({ zh: `加入边${ad}, 当前{${s.join(',')}}`, en: `add edge${ad}, S={${s.join(',')}}` })
        .setBars([{ value: s.length, role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: `最大交 ${S.length} 条边`, en: `max intersection ${S.length} edges` })
    .setBars([{ value: S.length, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
