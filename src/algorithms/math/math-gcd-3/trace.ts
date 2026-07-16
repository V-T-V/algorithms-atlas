// =============================================================================
// Stein GCD · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { binaryGcd, type SteinHooks } from './impl.ts';

export const DEFAULT_INPUT = { a: 84, b: 60 };

export function buildTrace(
  input: { a: number | bigint; b: number | bigint } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const steps: Array<{ a: string; b: string }> = [];

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars([
        {
          value: Number(steps.length > 0 ? steps[steps.length - 1]!.a : input.a.toString()),
          role: 'frontier',
        },
        {
          value: Number(steps.length > 0 ? steps[steps.length - 1]!.b : input.b.toString()),
          role: 'pivot',
        },
      ])
      .setAux(
        steps.map((s, i) => ({ label: `step${i}`, value: `(${s.a},${s.b})`, role: 'frontier' })),
      )
      .commit();
  };

  snap({ zh: `gcd(${input.a}, ${input.b})`, en: `gcd(${input.a}, ${input.b})` });

  const hooks: SteinHooks = {
    onStep: (a, b) => {
      steps.push({ a: a.toString(), b: b.toString() });
      snap({ zh: `a=${a}, b=${b}`, en: `a=${a}, b=${b}` });
    },
  };

  const ans = binaryGcd(input.a, input.b, hooks);

  rec
    .begin({ zh: `gcd=${ans}`, en: `gcd=${ans}` })
    .setAux([{ label: '答案', value: ans.toString(), role: 'final' }])
    .commit();

  return rec.build();
}
