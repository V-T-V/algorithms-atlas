// =============================================================================
// 动态字典压缩 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { dynDictEncode, dynDictDecode, type DynDictHooks } from './impl.ts';

export const DEFAULT_INPUT = 'ABABABABABABABA';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const learned: Array<{ code: number; seq: string }> = [];
  const emitted: Array<{ code: number; seq: string }> = [];

  rec
    .begin({ zh: `输入 "${input}"`, en: `Input "${input}"` })
    .setAux([{ label: '初始字典', value: '256 单字节', role: 'pivot' as BarRole }])
    .commit();

  const hooks: DynDictHooks = {
    onEmit: (code, seq) => emitted.push({ code, seq }),
    onLearn: (code, seq) => learned.push({ code, seq }),
  };

  const codes = dynDictEncode(input, hooks);
  const restored = dynDictDecode(codes);
  const ok = restored === input;

  rec
    .begin({ zh: `编码完成：${codes.length} 码`, en: `Encoded: ${codes.length} codes` })
    .setAux(
      emitted.map((e, i) => ({
        label: `C${i}`,
        value: `${e.code}="${e.seq}"`,
        role: 'final' as BarRole,
      })),
    )
    .commit();

  rec
    .begin({ zh: `学习到 ${learned.length} 个新词条`, en: `Learned ${learned.length} new entries` })
    .setAux(
      learned.map((e) => ({
        label: String(e.code),
        value: e.seq,
        role: 'pivot' as BarRole,
      })),
    )
    .commit();

  rec
    .begin({
      zh: `完成：往返${ok ? '一致' : '不一致'}`,
      en: `Done: ${ok ? 'OK' : 'FAIL'}`,
    })
    .setAux([
      { label: '原长度', value: String(input.length), role: 'compare' as BarRole },
      { label: '码数', value: String(codes.length), role: 'final' as BarRole },
      { label: '往返一致', value: ok ? '是' : '否', role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
