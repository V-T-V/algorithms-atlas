// =============================================================================
// 计数素数 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { countPrimes, type CountPrimesHooks } from './impl.ts';

export const DEFAULT_INPUT = 30;

export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const sieveSteps: Array<{ p: number; marked: number }> = [];

  rec
    .begin({ zh: `埃氏筛：统计 < ${input} 的素数`, en: `Sieve: count primes < ${input}` })
    .setAux([{ label: 'n', value: String(input), role: 'pivot' as BarRole }])
    .commit();

  const hooks: CountPrimesHooks = {
    onSieve: (p, marked) => sieveSteps.push({ p, marked }),
  };

  const result = countPrimes(input, hooks);

  for (const s of sieveSteps) {
    rec
      .begin({
        zh: `用素数 ${s.p} 筛除 ${s.marked} 个合数`,
        en: `Sieve with prime ${s.p}: marked ${s.marked} composites`,
      })
      .setAux([
        { label: '素数', value: String(s.p), role: 'compare' as BarRole },
        { label: '筛除数', value: String(s.marked), role: 'final' as BarRole },
      ])
      .commit();
  }

  rec
    .begin({ zh: `< ${input} 的素数共 ${result} 个`, en: `${result} primes < ${input}` })
    .setAux([{ label: '答案', value: String(result), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
