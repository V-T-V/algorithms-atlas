import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { findTheCity } from './impl.ts';
export const DEFAULT_INPUT = {
  n: 4,
  edges: [
    [0, 1, 3],
    [1, 2, 1],
    [1, 3, 4],
    [2, 3, 1],
  ] as Array<[number, number, number]>,
  threshold: 4,
};
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '城市阈值', en: 'City threshold' }).commit();
  const c = findTheCity(input.n, input.edges, input.threshold, {
    onCount: (city, cnt) =>
      rec
        .begin({ zh: '城市 ' + city + ' 可达 ' + cnt, en: 'city ' + city + ' reach ' + cnt })
        .setAux([{ label: 'count', value: String(cnt), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '城市 = ' + c, en: 'city = ' + c })
    .setAux([{ label: 'city', value: String(c), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
