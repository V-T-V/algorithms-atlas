// =============================================================================
// Delta-of-Delta 编码 · 录制帧序列
// setArray 展示时间戳序列 + 指针；setAux 展示一阶/二阶 delta。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { deltaOfDeltaEncode, type DeltaOfDeltaHooks } from './impl.ts';

export const DEFAULT_INPUT = [1000, 1010, 1020, 1030, 1031, 1032];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  let pos = 0;
  const out: number[] = [];

  const snapshot = (
    note: { zh: string; en: string },
    extra?: Array<{ label: string; value: string; role?: BarRole }>,
  ): void => {
    const roles: BarRole[] = input.map((_, i) =>
      i < pos ? 'final' : i === pos ? 'pivot' : 'default',
    );
    const pointers: Array<{ index: number; label: string }> = [];
    if (pos < n) pointers.push({ index: pos, label: 'i' });
    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      { label: '已编码', value: out.join(','), role: 'final' as BarRole },
    ];
    if (extra) aux.push(...extra);
    rec
      .begin(note)
      .setArray([...input], roles, pointers)
      .setAux(aux)
      .commit();
  };

  rec
    .begin({ zh: `输入时间戳 [${input.join(',')}]`, en: `Timestamps [${input.join(',')}]` })
    .setAux([{ label: '说明', value: '二阶差分', role: 'pivot' }])
    .commit();

  if (n > 0) {
    pos = 0;
    out.push(input[0]!);
    snapshot({ zh: `首项原样记录 ${input[0]}`, en: `First item stored as-is: ${input[0]}` });
  }

  const hooks: DeltaOfDeltaHooks = {
    onDelta: (i, prevDelta, curDelta, dod) => {
      pos = i;
      out.push(dod);
      snapshot(
        {
          zh: `i=${i}: delta=${curDelta}，dod=${dod}`,
          en: `i=${i}: delta=${curDelta}, dod=${dod}`,
        },
        [
          { label: '前 delta', value: String(prevDelta ?? 'null'), role: 'sorted' as BarRole },
          { label: '当前 delta', value: String(curDelta), role: 'frontier' as BarRole },
          { label: 'dod', value: String(dod), role: 'compare' as BarRole },
        ],
      );
    },
  };

  const result = deltaOfDeltaEncode(input, hooks);

  rec
    .begin({ zh: `完成`, en: `Done` })
    .setMap([
      { key: '原序列', value: input.join(','), role: 'default' as BarRole },
      { key: 'dod 序列', value: result.values.join(','), role: 'final' as BarRole },
      {
        key: '零的个数',
        value: String(result.values.filter((v) => v === 0).length),
        role: 'pivot' as BarRole,
      },
    ])
    .commit();

  return rec.build();
}
