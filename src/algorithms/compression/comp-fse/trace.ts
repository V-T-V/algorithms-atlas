import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { fseEncode } from './impl.ts';
const TABLE = new Map([
  [0, [1, 2, 3]],
  [1, [4, 5]],
  [2, [6, 7, 8, 9]],
]);
export const DEFAULT_INPUT = { symbols: [0, 1, 2, 0, 1], table: TABLE };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'FSE', en: 'FSE' }).commit();
  const state = fseEncode(input.symbols, input.table, {
    onState: (s, sym) =>
      rec
        .begin({ zh: 'sym=' + sym + ' state=' + s, en: 'state' })
        .setAux([
          { label: 'sym', value: String(sym), role: 'compare' as BarRole },
          { label: 'state', value: String(s), role: 'final' as BarRole },
        ])
        .commit(),
  });
  rec
    .begin({ zh: '终态 ' + state, en: 'state ' + state })
    .setAux([{ label: 'state', value: String(state), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
