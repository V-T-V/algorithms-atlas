import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sqrtSearch2, type Sqrt2Hooks } from './impl.ts';

export const DEFAULT_INPUT = 50;

export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `求 floor(sqrt(${input}))`, en: `Compute floor(sqrt(${input}))` })
    .setAux([{ label: 'x', value: String(input), role: 'pivot' as BarRole }])
    .commit();
  const hooks: Sqrt2Hooks = {
    onTry: (mid) => {
      rec
        .begin({
          zh: `尝试 mid=${mid}, mid*mid=${mid * mid}`,
          en: `Try mid=${mid}, mid*mid=${mid * mid}`,
        })
        .setAux([
          { label: 'mid', value: String(mid), role: 'compare' as BarRole },
          { label: 'mid*mid', value: String(mid * mid), role: 'frontier' as BarRole },
        ])
        .commit();
    },
  };
  const r = sqrtSearch2(input, hooks);
  rec
    .begin({ zh: `结果 floor(sqrt(${input}))=${r}`, en: `Result floor(sqrt(${input}))=${r}` })
    .setAux([{ label: 'sqrt', value: String(r), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
