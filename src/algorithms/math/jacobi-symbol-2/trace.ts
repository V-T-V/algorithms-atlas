// =============================================================================
// 雅可比符号（递归版）· 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { jacobi, type Jacobi2Hooks } from './impl.ts';

export const DEFAULT_INPUT: { a: bigint; n: bigint } = { a: 1001n, n: 9907n };

export function buildTrace(
  input: { a: bigint | number; n: bigint | number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const a = typeof input.a === 'number' ? BigInt(input.a) : input.a;
  const n = typeof input.n === 'number' ? BigInt(input.n) : input.n;

  const steps: Array<{ a: string; n: string; sign: number }> = [];

  rec
    .begin({ zh: `递归求 J(${a}, ${n})`, en: `Recursively compute J(${a}, ${n})` })
    .setAux([
      { label: 'a', value: a.toString(), role: 'frontier' },
      { label: 'n', value: n.toString(), role: 'frontier' },
    ])
    .commit();

  const hooks: Jacobi2Hooks = {
    onStep: (ca, cn, sign) => {
      steps.push({ a: ca.toString(), n: cn.toString(), sign });
      rec
        .begin({
          zh: `化简：J(${ca}, ${cn})，累积符号 = ${sign}`,
          en: `Reduce: J(${ca}, ${cn}), sign = ${sign}`,
        })
        .setAux(
          steps.map((s, i) => ({
            label: `#${i + 1}`,
            value: `J(${s.a},${s.n}) sign=${s.sign}`,
            role: i === steps.length - 1 ? 'compare' : 'default',
          })),
        )
        .commit();
    },
  };

  const v = jacobi(a, n, hooks);

  rec
    .begin({ zh: `J(${a}, ${n}) = ${v}`, en: `J(${a}, ${n}) = ${v}` })
    .setAux([{ label: '结果', value: String(v), role: 'final' }])
    .commit();

  return rec.build();
}
