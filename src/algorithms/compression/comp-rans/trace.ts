import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ransEncode } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = 'AABA'.split('').map((c) => c.charCodeAt(0));
  // M=8, A: freq=6 cumStart=0; B: freq=2 cumStart=6
  const M = 8;
  const table = new Map([
    ['A'.charCodeAt(0), { sym: 65, freq: 6, cumStart: 0 }],
    ['B'.charCodeAt(0), { sym: 66, freq: 2, cumStart: 6 }],
  ]);
  rec
    .begin({ zh: 'rANS', en: 'rANS' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  ransEncode(data, table, M, {
    onEncode: (s, st) =>
      rec
        .begin({ zh: `编码 '${String.fromCharCode(s)}' state=${st}`, en: '' })
        .setAux([{ label: 'state', value: String(st), role: 'final' as BarRole }])
        .commit(),
    onResult: (st) =>
      rec
        .begin({ zh: `最终 state=${st}`, en: `final state=${st}` })
        .setAux([{ label: 'final', value: String(st), role: 'final' as BarRole }])
        .commit(),
  });
  return rec.build();
}
