import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { eliminateLeftRecursion } from './impl.ts';

export const DEFAULT_INPUT = { head: 'E', alts: [['E', '+', 'T'], ['T']] };

export function buildTrace(input: { head: string; alts: string[][] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const fmt = (r: { head: string; alts: string[][] }): string =>
    `${r.head} -> ${r.alts.map((a) => (a.length ? a.join(' ') : 'ε')).join(' | ')}`;
  rec
    .begin({ zh: `原规则: ${fmt(input)}`, en: `Original: ${fmt(input)}` })
    .setAux([{ label: 'rule', value: fmt(input), role: 'compare' as BarRole }])
    .commit();
  const r = eliminateLeftRecursion(input);
  for (const rule of r.rules) {
    rec
      .begin({ zh: `生成: ${fmt(rule)}`, en: `emit: ${fmt(rule)}` })
      .setAux([{ label: rule.head, value: fmt(rule), role: 'final' as BarRole }])
      .commit();
  }
  return rec.build();
}
