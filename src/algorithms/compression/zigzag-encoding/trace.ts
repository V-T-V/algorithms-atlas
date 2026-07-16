// =============================================================================
// ZigZag 编码 · 录制帧序列
// setArray 展示输入有符号序列与对应无符号编码；setAux 展示当前映射。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { zigzagEncode, type ZigzagHooks } from './impl.ts';

export const DEFAULT_INPUT = [0, -1, 1, -2, 2, -3, 3, -100, 100];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const encoded: number[] = [];
  let pos = 0;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = input.map((_, i) =>
      i < pos ? 'final' : i === pos ? 'pivot' : 'default',
    );
    const pointers: Array<{ index: number; label: string }> = [];
    if (pos < input.length) pointers.push({ index: pos, label: 'i' });
    rec
      .begin(note)
      .setArray(
        // 展示「无符号编码值」而非原值，便于看到 ZigZag 的交替规律
        encoded.length === input.length
          ? [...encoded]
          : [...encoded, ...input.slice(pos).map(() => 0)],
        roles,
        pointers,
      )
      .setAux([
        { label: '已编码', value: encoded.join(','), role: 'final' as BarRole },
        { label: '原值', value: input.slice(0, pos).join(','), role: 'sorted' as BarRole },
      ])
      .commit();
  };

  rec
    .begin({ zh: `输入 [${input.join(',')}]`, en: `Input [${input.join(',')}]` })
    .setAux([{ label: '说明', value: '0→0, -1→1, 1→2, -2→3, 2→4 ...', role: 'pivot' }])
    .commit();

  const hooks: ZigzagHooks = {
    onEncode: (signed, unsigned) => {
      encoded.push(unsigned);
      snapshot({
        zh: `${signed} → ${unsigned}`,
        en: `${signed} -> ${unsigned}`,
      });
      pos++;
    },
  };

  // 逐个调用 hook（直接调用 encode 整批不会逐个回调顺序稳定，故逐个）
  for (const v of input) zigzagEncode(v, hooks);
  pos = input.length;

  rec
    .begin({ zh: `完成`, en: `Done` })
    .setMap([
      { key: '有符号输入', value: input.join(','), role: 'default' as BarRole },
      { key: 'ZigZag 编码', value: encoded.join(','), role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
