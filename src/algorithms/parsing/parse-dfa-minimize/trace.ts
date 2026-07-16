import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { minimizeDfa, type DfaSpec } from './impl.ts';

export const DEFAULT_INPUT: DfaSpec = {
  states: ['A', 'B', 'C', 'D'],
  alphabet: ['0', '1'],
  delta: {
    A: { '0': 'B', '1': 'A' },
    B: { '0': 'C', '1': 'A' },
    C: { '0': 'C', '1': 'D' },
    D: { '0': 'D', '1': 'D' },
  },
  start: 'A',
  accept: ['D'],
};

export function buildTrace(input: DfaSpec = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `原始 ${input.states.length} 状态`, en: `Original ${input.states.length} states` })
    .setAux(input.states.map((s) => ({ label: s, value: s, role: 'default' as BarRole })))
    .commit();
  const parts = minimizeDfa(input);
  for (let i = 0; i < parts.length; i++) {
    rec
      .begin({
        zh: `类 ${i} = {${parts[i]!.join(',')}}`,
        en: `Class ${i} = {${parts[i]!.join(',')}}`,
      })
      .setAux(parts[i]!.map((s) => ({ label: s, value: s, role: 'final' as BarRole })))
      .commit();
  }
  return rec.build();
}
