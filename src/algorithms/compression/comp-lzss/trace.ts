// =============================================================================
// LZSS · 录制帧序列
// 用 setArray 展示输入游标位置，setAux 展示已产出的 token。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lzssCompress, lzssDecompress, type LzssHooks } from './impl.ts';

export const DEFAULT_INPUT = [97, 98, 97, 98, 97, 98, 99, 100, 97, 98, 97, 98, 97, 98];

export function buildTrace(input: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const tokens: Array<{ isMatch: boolean; desc: string }> = [];
  let curPos = -1;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = new Array(input.length).fill('default');
    if (curPos >= 0) roles[curPos] = 'compare';
    const pointers =
      curPos >= 0 ? [{ index: Math.min(curPos, input.length - 1), label: 'pos' }] : [];
    rec
      .begin(note)
      .setArray([...input], roles, pointers)
      .setAux(
        tokens.map((t) => ({
          label: t.isMatch ? 'M' : 'L',
          value: t.desc,
          role: (t.isMatch ? 'final' : 'compare') as BarRole,
        })),
      )
      .commit();
  };

  snapshot({ zh: `输入 ${input.length} 字节`, en: `Input ${input.length} bytes` });

  const hooks: LzssHooks = {
    onToken: (pos, t) => {
      curPos = pos;
      if (t.isMatch) {
        tokens.push({ isMatch: true, desc: `(${t.distance},${t.length})` });
        snapshot({
          zh: `pos=${pos} 输出回引 (dist=${t.distance}, len=${t.length})`,
          en: `pos=${pos} emit match (dist=${t.distance}, len=${t.length})`,
        });
      } else {
        tokens.push({ isMatch: false, desc: `'${String.fromCharCode(t.literal!)}'` });
        snapshot({
          zh: `pos=${pos} 输出字面量 '${String.fromCharCode(t.literal!)}'`,
          en: `pos=${pos} emit literal '${String.fromCharCode(t.literal!)}'`,
        });
      }
    },
  };

  const toks = lzssCompress(input, { windowSize: 12, minMatch: 3, maxMatch: 6 }, hooks);
  const restored = lzssDecompress(toks);
  const ok = restored.length === input.length && restored.every((v, i) => v === input[i]);

  rec
    .begin({
      zh: `完成：${toks.length} 个 token，往返${ok ? '一致' : '不一致'}`,
      en: `Done: ${toks.length} tokens, roundtrip ${ok ? 'OK' : 'FAIL'}`,
    })
    .setAux([
      { label: 'Token 数', value: String(toks.length), role: 'pivot' as BarRole },
      {
        label: '回引数',
        value: String(toks.filter((t) => t.isMatch).length),
        role: 'final' as BarRole,
      },
      {
        label: '字面量数',
        value: String(toks.filter((t) => !t.isMatch).length),
        role: 'compare' as BarRole,
      },
      { label: '往返一致', value: ok ? '是' : '否', role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
