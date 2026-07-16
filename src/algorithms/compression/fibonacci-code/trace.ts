// Fibonacci编码 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { fibonacciCode, type FibonacciCodeHooks } from './impl.ts';

export interface FibInput {
  values: number[];
}

export const DEFAULT_INPUT: FibInput = { values: [0, 1, 2, 3, 10, 20] };

/** 录制演示帧序列。 */
export function buildTrace(input: FibInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { values } = input;

  rec
    .begin({ zh: `输入 [${values.join(',')}]`, en: `Input [${values.join(',')}]` })
    .setBars(values.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();

  const hooks: FibonacciCodeHooks = {
    onEncode: (v, bits) => {
      rec
        .begin({ zh: `${v} → ${bits}`, en: `${v} -> ${bits}` })
        .setAux([{ label: '码字', value: bits, role: 'compare' as BarRole }])
        .commit();
    },
  };
  const { bits } = fibonacciCode(values, hooks);

  rec
    .begin({ zh: `完成：${bits.length} 位`, en: `Done: ${bits.length} bits` })
    .setMap([
      {
        key: '比特流',
        value: bits.length > 40 ? bits.slice(0, 40) + '...' : bits,
        role: 'final' as BarRole,
      },
      { key: '位数', value: String(bits.length), role: 'pivot' as BarRole },
    ])
    .commit();

  return rec.build();
}
