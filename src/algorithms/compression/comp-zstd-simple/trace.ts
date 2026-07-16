// =============================================================================
// Zstd 简化 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { zstdCompress, zstdDecompress, type ZstdHooks } from './impl.ts';

export const DEFAULT_INPUT = [
  90, 115, 116, 100, 32, 116, 101, 115, 116, 32, 90, 115, 116, 100, 32, 116, 101, 115, 116,
];

export function buildTrace(input: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  let curPos = -1;
  const emitted: string[] = [];

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = new Array(input.length).fill('default');
    if (curPos >= 0 && curPos < input.length) roles[curPos] = 'compare';
    const pointers = curPos >= 0 && curPos < input.length ? [{ index: curPos, label: 'pos' }] : [];
    rec
      .begin(note)
      .setArray([...input], roles, pointers)
      .setAux(emitted.map((d, i) => ({ label: `T${i}`, value: d, role: 'final' as BarRole })))
      .commit();
  };

  snapshot({
    zh: `Zstd LZ77 阶段：输入 ${input.length} 字节`,
    en: `Zstd LZ77 stage: ${input.length} bytes`,
  });

  const hooks: ZstdHooks = {
    onToken: (pos, t) => {
      curPos = pos;
      if (t.isMatch) {
        emitted.push(`M(d=${t.distance},L=${t.length})`);
        snapshot({ zh: `pos=${pos} 回引`, en: `pos=${pos} match` });
      } else {
        emitted.push(`L'${String.fromCharCode(t.literal!)}'`);
        snapshot({ zh: `pos=${pos} 字面量`, en: `pos=${pos} literal` });
      }
    },
  };

  const toks = zstdCompress(input, { windowSize: 16, minMatch: 3, maxMatch: 32 }, hooks);
  const restored = zstdDecompress(toks);
  const ok = restored.length === input.length && restored.every((v, i) => v === input[i]);

  rec
    .begin({
      zh: `LZ77 阶段完成：${toks.length} token，往返${ok ? '一致' : '不一致'}`,
      en: `LZ77 stage done: ${toks.length} tokens, roundtrip ${ok ? 'OK' : 'FAIL'}`,
    })
    .setAux([
      { label: 'Token 数', value: String(toks.length), role: 'pivot' as BarRole },
      { label: '往返一致', value: ok ? '是' : '否', role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
