import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { toCnf, type Rule } from './impl.ts';

export const DEFAULT_INPUT: Rule[] = [{ head: 'S', syms: ['A', 'B', 'C', 'D'] }];

export function buildTrace(input: Rule[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const fmt = (r: Rule): string => `${r.head} -> ${r.syms.join(' ')}`;
  rec
    .begin({ zh: '原始规则', en: 'Original rules' })
    .setAux(input.map((r) => ({ label: r.head, value: fmt(r), role: 'compare' as BarRole })))
    .commit();
  const cnf = toCnf(input);
  rec
    .begin({ zh: `CNF: ${cnf.length} 条`, en: `CNF: ${cnf.length} rules` })
    .setAux(cnf.map((r) => ({ label: r.head, value: fmt(r), role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
