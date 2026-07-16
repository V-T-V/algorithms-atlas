import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { splitIntoFib } from './impl.ts';
export const DEFAULT_S = '11235813';
export function buildTrace(s: string = DEFAULT_S): Frame[] {
  const rec = new TraceRecorder();
  const cur: number[] = [];
  rec.begin({ zh: '拆 "' + s + '" 为斐波那契', en: 'Fib split' }).commit();
  splitIntoFib(s, {
    onNum: (v) => {
      cur.push(v);
      rec
        .begin({ zh: '切 ' + v, en: 'cut ' + v })
        .setBars(cur.map((x) => ({ value: x, role: 'pivot' as BarRole })))
        .commit();
    },
    onResult: (seq) =>
      rec
        .begin({ zh: seq.join(','), en: seq.join(',') })
        .setBars(seq.map((x) => ({ value: x, role: 'final' as BarRole })))
        .commit(),
  });
  rec.begin({ zh: '完成', en: 'Done' }).commit();
  return rec.build();
}
