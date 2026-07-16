// Golomb编码 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { golomb, type GolombHooks } from './impl.ts';

export interface GolombInput {
  values: number[];
  m: number;
}

export const DEFAULT_INPUT: GolombInput = { values: [0, 1, 5, 10, 15, 25], m: 8 };

/** 录制演示帧序列。 */
export function buildTrace(input: GolombInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { values, m } = input;

  rec
    .begin({ zh: `输入 [${values.join(',')}]，m=${m}`, en: `Input [${values.join(',')}], m=${m}` })
    .setBars(values.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();

  const hooks: GolombHooks = {
    onEncode: (v, bits) => {
      rec
        .begin({ zh: `${v} → ${bits}`, en: `${v} -> ${bits}` })
        .setAux([{ label: '码字', value: bits, role: 'compare' as BarRole }])
        .commit();
    },
  };
  const { bits } = golomb(values, m, hooks);

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
