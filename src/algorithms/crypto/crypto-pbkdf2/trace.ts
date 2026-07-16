import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { pbkdf2 } from './impl.ts';
export const DEFAULT_INPUT: any = {
  password: [1, 2, 3],
  salt: [9, 9, 9, 9],
  iterations: 5,
  dkLen: 8,
};
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'PBKDF2 iter=' + input.iterations, en: 'PBKDF2' }).commit();
  const out = pbkdf2(input.password, input.salt, input.iterations, input.dkLen, {
    onIter: (i) =>
      rec
        .begin({ zh: '迭代 ' + i, en: 'iter' })
        .setAux([{ label: 'iter', value: String(i), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: out.length + ' 字节', en: out.length + 'B' })
    .setAux([{ label: 'len', value: String(out.length), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
