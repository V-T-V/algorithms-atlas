import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildFromAst, lit, cat, star, or_ } from './impl.ts';

export const DEFAULT_AST = cat(star(or_(lit('a'), lit('b'))), lit('c'));

export function buildTrace(input = DEFAULT_AST): Frame[] {
  const rec = new TraceRecorder();
  const nfa = buildFromAst(input);
  rec
    .begin({
      zh: `Thompson NFA: ${nfa.states} 状态, ${nfa.edges.length} 边`,
      en: `Thompson NFA: ${nfa.states} states, ${nfa.edges.length} edges`,
    })
    .setAux(
      nfa.edges.map((e, i) => ({
        label: `e${i}`,
        value: `${e.from} -${e.input ?? 'ε'}-> ${e.to}`,
        role: (e.from === nfa.start || e.to === nfa.accept ? 'pivot' : 'default') as BarRole,
      })),
    )
    .commit();
  rec
    .begin({
      zh: `起点 ${nfa.start}, 接受 ${nfa.accept}`,
      en: `start ${nfa.start}, accept ${nfa.accept}`,
    })
    .setAux([
      { label: 'start', value: String(nfa.start), role: 'final' as BarRole },
      { label: 'accept', value: String(nfa.accept), role: 'final' as BarRole },
    ])
    .commit();
  return rec.build();
}
