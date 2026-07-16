import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { leftFactor } from './impl.ts';

export const DEFAULT_INPUT = {
  head: 'S',
  alts: [
    ['if', 'c', 'then', 'S'],
    ['if', 'c', 'then', 'S', 'else', 'S'],
  ],
};

export function buildTrace(input: { head: string; alts: string[][] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const fmt = (r: { head: string; alts: string[][] }): string =>
    `${r.head} -> ${r.alts.map((a) => (a.length ? a.join(' ') : 'ε')).join(' | ')}`;
  rec.begin({ zh: `原: ${fmt(input)}`, en: `Original: ${fmt(input)}` }).commit();
  const r = leftFactor(input);
  for (const rule of r.rules) {
    rec
      .begin({ zh: `生成: ${fmt(rule)}`, en: `emit: ${fmt(rule)}` })
      .setAux([{ label: rule.head, value: fmt(rule), role: 'final' as BarRole }])
      .commit();
  }
  return rec.build();
}
