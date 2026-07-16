// =============================================================================
// 扩展欧几里得 · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { extGcdIter, type ExtGcdHooks } from './impl.ts';

export const DEFAULT_INPUT = { a: 240, b: 46 };

export function buildTrace(
  input: { a: number | bigint; b: number | bigint } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const steps: Array<{ a: string; b: string; q: string }> = [];

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars([
        {
          value: steps.length > 0 ? Number(steps[steps.length - 1]!.a) : Number(input.a.toString()),
          role: 'frontier',
        },
        {
          value: steps.length > 0 ? Number(steps[steps.length - 1]!.b) : Number(input.b.toString()),
          role: 'pivot',
        },
      ])
      .setAux(
        steps.map((s, i) => ({
          label: `step${i}`,
          value: `${s.a}=${s.q}·${s.b}+r`,
          role: 'frontier',
        })),
      )
      .commit();
  };

  snap({ zh: `extGcd(${input.a}, ${input.b})`, en: `extGcd(${input.a}, ${input.b})` });

  const hooks: ExtGcdHooks = {
    onStep: (a, b, q) => {
      steps.push({ a: a.toString(), b: b.toString(), q: q.toString() });
      snap({ zh: `${a} = ${q}·${b} + r`, en: `${a} = ${q}*${b} + r` });
    },
  };

  const r = extGcdIter(input.a, input.b, hooks);

  rec
    .begin({ zh: `gcd=${r.g}, x=${r.x}, y=${r.y}`, en: `gcd=${r.g} x=${r.x} y=${r.y}` })
    .setAux([
      { label: 'gcd', value: r.g.toString(), role: 'final' },
      { label: 'x', value: r.x.toString(), role: 'frontier' },
      { label: 'y', value: r.y.toString(), role: 'frontier' },
    ])
    .commit();

  return rec.build();
}
