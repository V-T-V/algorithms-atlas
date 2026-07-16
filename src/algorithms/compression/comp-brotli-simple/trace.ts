// =============================================================================
// Brotli 简化 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { brotliCompress, brotliDecompress, STATIC_DICT, type BrotliHooks } from './impl.ts';

export const DEFAULT_INPUT = [
  104, 116, 116, 112, 58, 47, 47, 104, 116, 109, 108, 60, 47, 98, 111, 100, 121, 62,
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
    zh: `Brotli: 输入 ${input.length} 字节，静态字典 ${STATIC_DICT.length} 字节`,
    en: `Brotli: ${input.length} bytes, dict ${STATIC_DICT.length} bytes`,
  });

  const hooks: BrotliHooks = {
    onToken: (pos, t) => {
      curPos = pos;
      if (t.isMatch) {
        emitted.push(`${t.fromDict ? 'D' : 'M'}(d=${t.distance},L=${t.length})`);
        snapshot({
          zh: `pos=${pos} ${t.fromDict ? '字典' : '窗口'}命中`,
          en: `pos=${pos} ${t.fromDict ? 'dict' : 'window'} match`,
        });
      } else {
        emitted.push(`L'${String.fromCharCode(t.literal!)}'`);
        snapshot({ zh: `pos=${pos} 字面量`, en: `pos=${pos} literal` });
      }
    },
  };

  const toks = brotliCompress(input, STATIC_DICT, hooks);
  const restored = brotliDecompress(toks, STATIC_DICT);
  const ok = restored.length === input.length && restored.every((v, i) => v === input[i]);

  rec
    .begin({
      zh: `完成：${toks.length} token，往返${ok ? '一致' : '不一致'}`,
      en: `Done: ${toks.length} tokens, ${ok ? 'OK' : 'FAIL'}`,
    })
    .setAux([
      {
        label: '字典命中',
        value: String(toks.filter((t) => t.isMatch && t.fromDict).length),
        role: 'final' as BarRole,
      },
      {
        label: '窗口命中',
        value: String(toks.filter((t) => t.isMatch && !t.fromDict).length),
        role: 'compare' as BarRole,
      },
      { label: '往返一致', value: ok ? '是' : '否', role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
