// =============================================================================
// Snappy · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { snappyCompress, snappyDecompress, type SnappyHooks, type SnappyToken } from './impl.ts';

export const DEFAULT_INPUT = [
  116, 104, 101, 32, 113, 117, 105, 99, 107, 32, 116, 104, 101, 32, 102, 111, 120,
];

export function buildTrace(input: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  let curPos = -1;
  const toks: SnappyToken[] = [];

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = new Array(input.length).fill('default');
    if (curPos >= 0 && curPos < input.length) roles[curPos] = 'compare';
    const pointers = curPos >= 0 && curPos < input.length ? [{ index: curPos, label: 'pos' }] : [];
    rec
      .begin(note)
      .setArray([...input], roles, pointers)
      .setAux(
        toks.map((t, i) => ({
          label: `T${i}`,
          value:
            t.type === 'literal'
              ? `lit(${t.literals!.length})`
              : `copy(d=${t.distance},L=${t.length})`,
          role: (t.type === 'copy' ? 'final' : 'compare') as BarRole,
        })),
      )
      .commit();
  };

  snapshot({ zh: `输入 ${input.length} 字节`, en: `Input ${input.length} bytes` });

  const hooks: SnappyHooks = {
    onToken: (pos, t) => {
      curPos = pos;
      toks.push(t);
      snapshot({
        zh: `pos=${pos} 输出 copy (d=${t.distance}, L=${t.length})`,
        en: `pos=${pos} emit copy (d=${t.distance}, L=${t.length})`,
      });
    },
  };

  const all = snappyCompress(input, { windowSize: 16, minMatch: 4, maxMatch: 64 }, hooks);
  const restored = snappyDecompress(all);
  const ok = restored.length === input.length && restored.every((v, i) => v === input[i]);
  void toks;

  rec
    .begin({
      zh: `完成：${all.length} 个 token，往返${ok ? '一致' : '不一致'}`,
      en: `Done: ${all.length} tokens, roundtrip ${ok ? 'OK' : 'FAIL'}`,
    })
    .setAux([
      { label: 'Token 数', value: String(all.length), role: 'pivot' as BarRole },
      {
        label: 'copy 数',
        value: String(all.filter((t) => t.type === 'copy').length),
        role: 'final' as BarRole,
      },
      { label: '往返一致', value: ok ? '是' : '否', role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
