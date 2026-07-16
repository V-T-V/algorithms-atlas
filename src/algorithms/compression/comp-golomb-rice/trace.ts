// =============================================================================
// Golomb-Rice · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  golombRiceEncodeAll,
  golombRiceDecodeAll,
  optimalK,
  type GolombRiceHooks,
} from './impl.ts';

export const DEFAULT_INPUT = [0, 1, 2, 3, 5, 8, 13, 21];

export function buildTrace(input: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const codes: Array<{ n: number; code: string }> = [];
  const k = optimalK(input);

  rec
    .begin({
      zh: `输入：[${input.join(', ')}]，自动选 k=${k}`,
      en: `Input: [${input.join(', ')}], auto k=${k}`,
    })
    .setAux(input.map((n, i) => ({ label: `n${i}`, value: String(n), role: 'pivot' as BarRole })))
    .commit();

  const hooks: GolombRiceHooks = {
    onEncode: (n, _k, code) => codes.push({ n, code }),
  };

  const bits = golombRiceEncodeAll(input, k, hooks);
  const decoded = golombRiceDecodeAll(bits, k);
  const ok = decoded.length === input.length && decoded.every((v, i) => v === input[i]);

  for (const c of codes) {
    rec
      .begin({ zh: `n=${c.n} → ${c.code}`, en: `n=${c.n} → ${c.code}` })
      .setAux([
        { label: 'n', value: String(c.n), role: 'compare' as BarRole },
        { label: 'k', value: String(k), role: 'pivot' as BarRole },
        { label: '编码', value: c.code, role: 'final' as BarRole },
      ])
      .commit();
  }

  rec
    .begin({
      zh: `完成：${bits.length} bit，往返${ok ? '一致' : '不一致'}`,
      en: `Done: ${bits.length} bits, ${ok ? 'OK' : 'FAIL'}`,
    })
    .setAux([
      { label: 'k', value: String(k), role: 'pivot' as BarRole },
      { label: '总位数', value: String(bits.length), role: 'final' as BarRole },
      { label: '往返一致', value: ok ? '是' : '否', role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
