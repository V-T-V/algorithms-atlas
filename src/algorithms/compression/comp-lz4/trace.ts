// =============================================================================
// LZ4 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lz4Compress, lz4Decompress, type Lz4Hooks } from './impl.ts';

export const DEFAULT_INPUT = [
  72, 101, 108, 108, 111, 32, 72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100,
];

export function buildTrace(input: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  let curPos = -1;
  const tokenList: string[] = [];

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = new Array(input.length).fill('default');
    if (curPos >= 0 && curPos < input.length) roles[curPos] = 'compare';
    const pointers = curPos >= 0 && curPos < input.length ? [{ index: curPos, label: 'pos' }] : [];
    rec
      .begin(note)
      .setArray([...input], roles, pointers)
      .setAux(
        tokenList.map((desc, i) => ({
          label: `T${i}`,
          value: desc,
          role: 'final' as BarRole,
        })),
      )
      .commit();
  };

  snapshot({ zh: `输入 ${input.length} 字节`, en: `Input ${input.length} bytes` });

  const hooks: Lz4Hooks = {
    onToken: (pos, t) => {
      curPos = pos;
      const lit = t.literals.map((b) => String.fromCharCode(b)).join('');
      tokenList.push(`lit="${lit}" M=(d=${t.distance},L=${t.matchLength + 3})`);
      snapshot({
        zh: `pos=${pos} 输出 token（字面量 ${t.literals.length} 字节 + 匹配 len=${t.matchLength + 3}）`,
        en: `pos=${pos} emit token (${t.literals.length} literals + match len=${t.matchLength + 3})`,
      });
    },
  };

  const toks = lz4Compress(input, { windowSize: 12, minMatch: 3, maxMatch: 33 }, hooks);
  const restored = lz4Decompress(toks, 3);
  const ok = restored.length === input.length && restored.every((v, i) => v === input[i]);

  rec
    .begin({
      zh: `完成：${toks.length} 个 token，往返${ok ? '一致' : '不一致'}`,
      en: `Done: ${toks.length} tokens, roundtrip ${ok ? 'OK' : 'FAIL'}`,
    })
    .setAux([
      { label: 'Token 数', value: String(toks.length), role: 'pivot' as BarRole },
      { label: '往返一致', value: ok ? '是' : '否', role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
