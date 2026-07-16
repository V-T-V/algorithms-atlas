// =============================================================================
// 整数算术编码 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { arithIntEncode, arithIntDecode, buildModel, type ArithIntHooks } from './impl.ts';

export const DEFAULT_INPUT = [0, 0, 1, 0, 2, 0, 1];
const DEFAULT_FREQ = new Map([
  [0, 5],
  [1, 3],
  [2, 2],
]);

export function buildTrace(input: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const steps: Array<{ sym: number; lo: number; range: number }> = [];
  const model = buildModel(DEFAULT_FREQ);

  rec
    .begin({
      zh: `输入 ${input.length} 符号，模型 ${model.syms.length} 符号 total=${model.total}`,
      en: `Input ${input.length} syms, model ${model.syms.length} total=${model.total}`,
    })
    .setAux(
      model.syms.map((s, i) => ({
        label: `s${s}`,
        value: `cum=${model.cum[i]}-${model.cum[i + 1]}`,
        role: 'pivot' as BarRole,
      })),
    )
    .commit();

  const hooks: ArithIntHooks = {
    onSymbol: (sym, lo, range) => steps.push({ sym, lo, range }),
  };

  const bits = arithIntEncode(input, model, 32, hooks);
  const decoded = arithIntDecode(bits, model, input.length, 32);
  const ok = decoded.length === input.length && decoded.every((v, i) => v === input[i]);

  for (const s of steps) {
    rec
      .begin({
        zh: `sym=${s.sym} → lo=${s.lo}, range=${s.range}`,
        en: `sym=${s.sym} → lo=${s.lo}, range=${s.range}`,
      })
      .setAux([
        { label: '符号', value: String(s.sym), role: 'compare' as BarRole },
        { label: 'lo', value: String(s.lo), role: 'pivot' as BarRole },
        { label: 'range', value: String(s.range), role: 'final' as BarRole },
      ])
      .commit();
  }

  rec
    .begin({
      zh: `完成：32-bit 编码，往返${ok ? '一致' : '不一致'}`,
      en: `Done: 32-bit code, ${ok ? 'OK' : 'FAIL'}`,
    })
    .setAux([
      { label: '编码值', value: bits, role: 'final' as BarRole },
      { label: '往返一致', value: ok ? '是' : '否', role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
