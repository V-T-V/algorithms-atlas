import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { detectAmbiguity, type Rule } from './impl.ts';

export const DEFAULT_INPUT: Rule[] = [{ head: 'S', alts: [['S', '+', 'S'], ['id']] }];

export function buildTrace(input: Rule[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `规则数: ${input.length}`, en: `${input.length} rules` })
    .setAux(
      input.map((r) => ({
        label: r.head,
        value: r.alts.map((a) => a.join(' ')).join(' | '),
        role: 'compare' as BarRole,
      })),
    )
    .commit();
  const warns = detectAmbiguity(input);
  for (const w of warns) {
    rec
      .begin({ zh: `[${w.rule}] ${w.reason}`, en: `[${w.rule}] ${w.reason}` })
      .setAux([{ label: w.rule, value: w.reason, role: 'warn' as BarRole }])
      .commit();
  }
  if (warns.length === 0) rec.begin({ zh: '无明显歧义', en: 'no obvious ambiguity' }).commit();
  return rec.build();
}
