import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { phaserSync } from './impl.ts';
export const DEFAULT_INPUT = { parties: 3, phases: 3 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Phaser', en: 'Phaser' }).commit();
  const phases = phaserSync(input.parties, input.phases, {
    onArrive: (t, ph) =>
      rec
        .begin({ zh: 'T' + t + ' 到达阶段' + ph, en: 'arrive' })
        .setAux([{ label: 'phase', value: String(ph), role: 'pivot' as BarRole }])
        .commit(),
    onAdvance: (ph, n) =>
      rec
        .begin({ zh: '阶段' + ph + ' 推进 (' + n + '方)', en: 'advance' })
        .setAux([{ label: 'advance', value: 'ph' + ph, role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '总阶段 ' + phases, en: 'phases' })
    .setAux([{ label: 'phases', value: String(phases), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
