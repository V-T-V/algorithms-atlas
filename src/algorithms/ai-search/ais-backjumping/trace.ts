import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { conflictBackjumping, type Csp } from './impl.ts';
const C: Csp = {
  vars: [0, 1, 2],
  domain: [0, 1, 2],
  consistent: (p, i, v) => {
    for (const [k, val] of p) if (k !== i && val === v) return false;
    return true;
  },
};
export const DEFAULT_INPUT = C;
export function buildTrace(input: Csp = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '冲突回跳', en: 'CBJ' }).commit();
  const r = conflictBackjumping(input, {
    onAssign: (i, v) =>
      rec
        .begin({ zh: 'x' + i + '=' + v, en: 'x' + i + '=' + v })
        .setAux([
          { label: 'var', value: 'x' + i, role: 'compare' as BarRole },
          { label: 'val', value: String(v), role: 'pivot' as BarRole },
        ])
        .commit(),
    onJump: (f, t) =>
      rec
        .begin({ zh: '从' + f + '跳到' + t, en: f + '->' + t })
        .setAux([{ label: 'jump', value: f + '->' + t, role: 'warn' as BarRole }])
        .commit(),
    onFound: (a) =>
      rec
        .begin({ zh: '解 ' + a.join(','), en: 'sol ' + a.join(',') })
        .setAux([{ label: 'sol', value: a.join(','), role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: r ? '求解成功' : '无解', en: r ? 'solved' : 'fail' })
    .setAux([{ label: 'result', value: r ? r.join(',') : 'none', role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
