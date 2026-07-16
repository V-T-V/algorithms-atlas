// =============================================================================
// Tribonacci · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { tribonacci, type TribonacciHooks } from './impl.ts';

export const DEFAULT_INPUT: { n: number } = { n: 15 };

const fmt = (m: bigint[][]): string => m.map((r) => `[${r.join(',')}]`).join(' ');

export function buildTrace(input: { n: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { n } = input;

  rec
    .begin({ zh: `用矩阵快速幂计算 T(${n})`, en: `Compute T(${n}) via matrix fast exponentiation` })
    .setAux([{ label: 'n', value: String(n), role: 'frontier' }])
    .commit();

  const hooks: TribonacciHooks = {
    onStep: (bit, m) => {
      rec
        .begin({
          zh: `指数位=${bit}，base 矩阵= ${fmt(m)}`,
          en: `bit=${bit}, base matrix= ${fmt(m)}`,
        })
        .setAux([
          { label: '位', value: String(bit), role: 'compare' },
          { label: 'base', value: fmt(m), role: 'frontier' },
        ])
        .commit();
    },
  };

  const t = tribonacci(n, hooks);

  rec
    .begin({ zh: `T(${n}) = ${t}`, en: `T(${n}) = ${t}` })
    .setAux([{ label: `T(${n})`, value: t.toString(), role: 'final' }])
    .commit();

  return rec.build();
}
