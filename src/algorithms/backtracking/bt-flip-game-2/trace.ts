// 翻转游戏 II · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { btFlipGame2, type BtFlipGame2Hooks } from './impl.ts';

export const DEFAULT_INPUT = '++++';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const codes = Array.from(input).map((c) => (c === '+' ? 1 : 0));

  rec
    .begin({ zh: `状态「${input}」先手能否必胜`, en: `Can first player win "${input}"?` })
    .setArray(
      codes,
      codes.map(() => 'default' as BarRole),
      [],
    )
    .setAux([{ label: 'state', value: input, role: 'pivot' }])
    .commit();

  const hooks: BtFlipGame2Hooks = {
    onSegment: (length, sg) => {
      rec
        .begin({ zh: `连续段长 ${length}，SG = ${sg}`, en: `Run len ${length}, SG = ${sg}` })
        .setAux([{ label: `seg(${length})`, value: String(sg), role: 'compare' as BarRole }])
        .commit();
    },
    onXor: (xorSum) => {
      rec
        .begin({ zh: `异或和 = ${xorSum}`, en: `xor sum = ${xorSum}` })
        .setAux([{ label: 'xor', value: String(xorSum), role: 'pivot' }])
        .commit();
    },
  };

  const result = btFlipGame2(input, hooks);

  rec
    .begin({
      zh: `结论：先手${result ? '必胜' : '必败'}`,
      en: `Result: first player ${result ? 'wins' : 'loses'}`,
    })
    .setAux([{ label: '结论', value: result ? 'WIN' : 'LOSE', role: result ? 'final' : 'warn' }])
    .commit();

  return rec.build();
}
