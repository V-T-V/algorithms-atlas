import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { analyzeReachability, type Rule } from './impl.ts';

export const DEFAULT_INPUT: { rules: Rule[]; start: string } = {
  rules: [
    { head: 'S', syms: ['A', 'B'] },
    { head: 'A', syms: ['x'] },
    { head: 'B', syms: ['A'] },
    { head: 'C', syms: ['y'] },
  ],
  start: 'S',
};

export function buildTrace(input: { rules: Rule[]; start: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: `起始符: ${input.start}`, en: `Start: ${input.start}` }).commit();
  const r = analyzeReachability(input.rules, input.start);
  rec
    .begin({
      zh: `可达: {${[...r.reachable].join(',')}}`,
      en: `Reachable: {${[...r.reachable].join(',')}}`,
    })
    .setAux([...r.reachable].map((s) => ({ label: s, value: s, role: 'final' as BarRole })))
    .commit();
  if (r.unreachable.length) {
    rec
      .begin({
        zh: `不可达: {${r.unreachable.join(',')}}`,
        en: `Unreachable: {${r.unreachable.join(',')}}`,
      })
      .setAux(r.unreachable.map((s) => ({ label: s, value: s, role: 'warn' as BarRole })))
      .commit();
  }
  return rec.build();
}
