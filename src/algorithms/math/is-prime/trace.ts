// =============================================================================
// 素数判定 · 录制帧序列
// 通过 isPrime 的钩子，把试除过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { isPrime, type IsPrimeHooks } from './impl.ts';

export const DEFAULT_INPUT = 97;

/** 录制演示帧序列。 */
export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input;
  const tried: Array<{ key: string; value: string; role?: BarRole }> = [];

  const snapshot = (note: { zh: string; en: string }): void => {
    rec.begin(note).setMap(tried.slice()).commit();
  };

  rec
    .begin({
      zh: `判定 ${n} 是否为素数（试除 6k±1 候选）`,
      en: `Test if ${n} is prime (trial division by 6k±1)`,
    })
    .setMap([{ key: 'n', value: String(n), role: 'frontier' }])
    .commit();

  const hooks: IsPrimeHooks = {
    onTrial: (d) => {
      tried.push({
        key: `试 ${d}`,
        value: `${n} mod ${d} = ${n % d}`,
        role: n % d === 0 ? 'warn' : 'default',
      });
      snapshot({
        zh: `试除 ${d}：${n} mod ${d} = ${n % d}`,
        en: `Trial ${d}: ${n} mod ${d} = ${n % d}`,
      });
    },
    onFactor: (d) => {
      tried.push({ key: '因子', value: `${d}`, role: 'warn' });
      snapshot({ zh: `发现因子 ${d}，${n} 是合数`, en: `Found factor ${d}; ${n} is composite` });
    },
    onResult: (prime) => {
      tried.push({
        key: '结论',
        value: prime ? `${n} 是素数` : `${n} 是合数`,
        role: prime ? 'final' : 'warn',
      });
      snapshot({
        zh: prime ? `${n} 无因子，是素数` : `${n} 是合数`,
        en: prime ? `${n} has no divisor; prime` : `${n} is composite`,
      });
    },
  };

  isPrime(n, hooks);
  return rec.build();
}
