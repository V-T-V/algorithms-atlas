import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simHash, hamming32 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const doc1: ReadonlyArray<readonly [string, number]> = [
    ['hello', 3],
    ['world', 2],
    ['foo', 1],
  ];
  const doc2: ReadonlyArray<readonly [string, number]> = [
    ['hello', 3],
    ['world', 2],
    ['bar', 1],
  ];
  rec.begin({ zh: 'SimHash', en: 'SimHash' }).commit();
  const f1 = simHash(doc1);
  const f2 = simHash(doc2);
  const dist = hamming32(f1, f2);
  rec
    .begin({ zh: `汉明距离 ${dist}`, en: `Hamming ${dist}` })
    .setBars([{ value: dist, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
