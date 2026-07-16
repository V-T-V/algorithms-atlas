// =============================================================================
// Gamma + RLE 混合 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gammaRunEncode, gammaRunDecode, type GammaRunHooks } from './impl.ts';

export const DEFAULT_INPUT = [0, 0, 0, 1, 1, 0, 2, 2, 2, 2, 2, 3, 3];

export function buildTrace(input: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const runs: Array<{ sym: number; length: number }> = [];

  rec
    .begin({ zh: `输入 ${input.length} 字节`, en: `Input ${input.length} bytes` })
    .setArray(
      [...input],
      input.map(() => 'default' as BarRole),
      [],
    )
    .commit();

  const hooks: GammaRunHooks = {
    onRun: (sym, length) => runs.push({ sym, length }),
  };

  const bits = gammaRunEncode(input, hooks);
  const decoded = gammaRunDecode(bits);
  const ok = decoded.length === input.length && decoded.every((v, i) => v === input[i]);

  for (let i = 0; i < runs.length; i++) {
    const r = runs[i]!;
    rec
      .begin({
        zh: `游程[${i}] 符号=${r.sym} 长度=${r.length} → gamma`,
        en: `run[${i}] sym=${r.sym} len=${r.length} → gamma`,
      })
      .setAux([
        { label: '符号', value: String(r.sym), role: 'compare' as BarRole },
        { label: '长度', value: String(r.length), role: 'pivot' as BarRole },
        {
          label: 'gamma',
          value: ((n: number): string => '0'.repeat(n.toString(2).length - 1) + n.toString(2))(
            r.length,
          ),
          role: 'final' as BarRole,
        },
      ])
      .commit();
  }

  rec
    .begin({
      zh: `完成：${bits.length} bit（${runs.length} 游程），往返${ok ? '一致' : '不一致'}`,
      en: `Done: ${bits.length} bits (${runs.length} runs), ${ok ? 'OK' : 'FAIL'}`,
    })
    .setAux([
      { label: '游程数', value: String(runs.length), role: 'pivot' as BarRole },
      { label: '总位数', value: String(bits.length), role: 'final' as BarRole },
      { label: '往返一致', value: ok ? '是' : '否', role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
