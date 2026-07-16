import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { randomRestartHill, type RrhcProblem } from './impl.ts';
const P: RrhcProblem = {
  domain: [0, 10],
  eval: (x) => -Math.abs(x - 7) + 10,
  neighbors: (x) => [x - 1, x + 1],
  rand: () => Math.floor(Math.random() * 10),
};
export const DEFAULT_INPUT = P;
export function buildTrace(input: RrhcProblem = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '随机重启爬山', en: 'Random-Restart HC' }).commit();
  const best = randomRestartHill(input, 3, {
    onRestart: (r) =>
      rec
        .begin({ zh: '重启 #' + r, en: 'restart #' + r })
        .setAux([{ label: 'restart', value: String(r), role: 'pivot' as BarRole }])
        .commit(),
    onStep: (s, v) =>
      rec
        .begin({ zh: '状态 ' + s + ' 值' + v.toFixed(1), en: 'state ' + s })
        .setAux([{ label: 'state', value: String(s), role: 'compare' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '最优 ' + best, en: 'best ' + best })
    .setAux([{ label: 'best', value: String(best), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
