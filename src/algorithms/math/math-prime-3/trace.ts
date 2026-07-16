// =============================================================================
// Miller-Rabin · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { isPrime, type MillerRabinHooks } from './impl.ts';

export const DEFAULT_INPUT = 561; // 卡迈克尔数

export function buildTrace(n: number | bigint = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const witnesses: Array<{ a: string; verdict: string }> = [];
  let result = false;

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setAux(
        witnesses.length
          ? witnesses.map((w) => ({
              label: `a=${w.a}`,
              value: w.verdict,
              role: w.verdict === 'composite' ? 'warn' : 'frontier',
            }))
          : [{ label: 'N', value: String(n), role: 'pivot' }],
      )
      .commit();
  };

  snap({ zh: `测试 N=${n}`, en: `Testing N=${n}` });

  const hooks: MillerRabinHooks = {
    onWitness: (a, v) => {
      witnesses.push({ a: String(a), verdict: v });
      snap({ zh: `witness a=${a}: ${v}`, en: `witness a=${a}: ${v}` });
    },
    onDone: (p) => {
      result = p;
    },
  };

  isPrime(n, hooks);

  rec
    .begin({
      zh: `${n} ${result ? '是素数' : '是合数'}`,
      en: `${n} ${result ? 'prime' : 'composite'}`,
    })
    .setAux([
      { label: '结果', value: result ? 'prime' : 'composite', role: result ? 'final' : 'warn' },
    ])
    .commit();

  return rec.build();
}
