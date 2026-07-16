import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { epsilonClosure, nfaRun, type EpsilonNfa } from './impl.ts';

export const DEFAULT_INPUT: { nfa: EpsilonNfa; input: string[] } = {
  nfa: {
    states: ['q0', 'q1', 'q2'],
    alphabet: ['a', 'b'],
    edges: [
      { from: 'q0', input: null, to: 'q1' },
      { from: 'q0', input: 'a', to: 'q0' },
      { from: 'q1', input: 'b', to: 'q2' },
    ],
    start: 'q0',
    accept: ['q2'],
  },
  input: ['a', 'a', 'b'],
};

export function buildTrace(input: { nfa: EpsilonNfa; input: string[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  let cur = epsilonClosure(input.nfa, new Set([input.nfa.start]));
  rec
    .begin({ zh: `初始闭包: {${[...cur].join(',')}}`, en: `init closure: {${[...cur].join(',')}}` })
    .setAux([...cur].map((s) => ({ label: s, value: s, role: 'pivot' as BarRole })))
    .commit();
  for (const a of input.input) {
    const next = new Set<string>();
    for (const s of cur)
      for (const e of input.nfa.edges) if (e.from === s && e.input === a) next.add(e.to);
    cur = epsilonClosure(input.nfa, next);
    rec
      .begin({
        zh: `读 ${a} → 闭包 {${[...cur].join(',')}}`,
        en: `read ${a} -> closure {${[...cur].join(',')}}`,
      })
      .setAux([...cur].map((s) => ({ label: s, value: s, role: 'frontier' as BarRole })))
      .commit();
  }
  const ok = nfaRun(input.nfa, input.input);
  rec
    .begin({ zh: ok ? '接受' : '拒绝', en: ok ? 'accept' : 'reject' })
    .setAux([{ label: 'result', value: ok ? 'accept' : 'reject', role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
