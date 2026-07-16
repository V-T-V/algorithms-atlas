// =============================================================================
// 静态字典压缩 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { staticDictEncode, staticDictDecode, DEFAULT_DICT, type StaticDictHooks } from './impl.ts';

export const DEFAULT_INPUT = 'the http and html tion';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const events: Array<{ text: string; code: number; isMatch: boolean }> = [];

  rec
    .begin({
      zh: `输入 "${input}"，字典 ${DEFAULT_DICT.size} 项`,
      en: `Input "${input}", dict ${DEFAULT_DICT.size} entries`,
    })
    .setAux(
      [...DEFAULT_DICT.entries()].map(([k, v]) => ({
        label: k,
        value: String(v),
        role: 'pivot' as BarRole,
      })),
    )
    .commit();

  const hooks: StaticDictHooks = {
    onMatch: (text, code) => events.push({ text, code, isMatch: true }),
    onLiteral: (ch) => events.push({ text: ch, code: 32768 + ch.charCodeAt(0), isMatch: false }),
  };

  const codes = staticDictEncode(input, DEFAULT_DICT, hooks);
  const restored = staticDictDecode(codes, DEFAULT_DICT);
  const ok = restored === input;

  for (const e of events) {
    rec
      .begin({
        zh: `${e.isMatch ? '字典命中' : '字面量'} "${e.text}" → ${e.code}`,
        en: `${e.isMatch ? 'match' : 'literal'} "${e.text}" → ${e.code}`,
      })
      .setAux([
        { label: '片段', value: e.text, role: 'compare' as BarRole },
        { label: '码', value: String(e.code), role: 'final' as BarRole },
        { label: '类型', value: e.isMatch ? '字典' : '字面量', role: 'pivot' as BarRole },
      ])
      .commit();
  }

  rec
    .begin({
      zh: `完成：${codes.length} 码（原 ${input.length} 字符），往返${ok ? '一致' : '不一致'}`,
      en: `Done: ${codes.length} codes (${input.length} chars), ${ok ? 'OK' : 'FAIL'}`,
    })
    .setAux([
      { label: '原长度', value: String(input.length), role: 'compare' as BarRole },
      { label: '码数', value: String(codes.length), role: 'final' as BarRole },
      { label: '往返一致', value: ok ? '是' : '否', role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
