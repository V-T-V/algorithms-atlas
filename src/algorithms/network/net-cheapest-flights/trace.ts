import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { findCheapestPrice } from './impl.ts';
export const DEFAULT_INPUT = {
  n: 4,
  flights: [
    [0, 1, 100],
    [1, 2, 100],
    [2, 3, 100],
    [0, 2, 500],
  ] as Array<[number, number, number]>,
  src: 0,
  dst: 3,
  k: 1,
};
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'K站最便宜航班', en: 'Cheapest flights K=' + input.k }).commit();
  const c = findCheapestPrice(input.n, input.flights, input.src, input.dst, input.k, {
    onRound: (r) =>
      rec
        .begin({ zh: '第 ' + r + ' 轮', en: 'round ' + r })
        .setAux([{ label: 'round', value: String(r), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '最低价 = ' + c, en: 'cheapest = ' + c })
    .setAux([{ label: 'price', value: String(c), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
