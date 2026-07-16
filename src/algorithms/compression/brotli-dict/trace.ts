// =============================================================================
// Brotli 风格字典压缩 · 录制帧序列
// setArray 展示输入字节流与当前指针/匹配区，setMap 展示字典与已输出 token。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  brotliDictCompress,
  DICTIONARY,
  toBytes,
  type BrotliDictHooks,
  type BrotliDictToken,
} from './impl.ts';

export const DEFAULT_INPUT = 'http://www.example.com/html/body';

function vis(c: number): string {
  if (c < 32 || c > 126) return `·${c}`;
  return String.fromCharCode(c);
}

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const data = toBytes(input);
  const emitted: BrotliDictToken[] = [];
  let pos = 0;
  let litBuf: number[] = [];
  let matchRange: { len: number; word: string } | null = null;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = data.map((_, i) => {
      if (i < pos) return 'final';
      if (matchRange && i >= pos && i < pos + matchRange.len) return 'compare';
      if (i === pos) return 'pivot';
      return 'default';
    });
    const pointers: Array<{ index: number; label: string }> = [];
    if (pos < data.length) pointers.push({ index: pos, label: 'pos' });
    rec
      .begin(note)
      .setArray([...data], roles, pointers)
      .setAux([
        {
          label: 'literal 累积',
          value: litBuf.map(vis).join('') || '∅',
          role: 'frontier' as BarRole,
        },
        {
          label: '已输出',
          value: emitted.length
            ? emitted
                .map((t) =>
                  t.kind === 'lit' ? `lit(${t.bytes.length})` : `dict[${t.index}]*${t.length}`,
                )
                .join(' ')
            : '∅',
          role: 'final' as BarRole,
        },
      ])
      .commit();
    matchRange = null;
  };

  rec
    .begin({ zh: `输入「${input}」`, en: `Input "${input}"` })
    .setMap(DICTIONARY.map((w, i) => ({ key: String(i), value: w, role: 'sorted' as BarRole })))
    .commit();

  snapshot({ zh: `开始扫描`, en: `Start scanning` });

  const hooks: BrotliDictHooks = {
    onLiteral: (p, byte) => {
      pos = p;
      litBuf.push(byte);
      snapshot({ zh: `literal '${vis(byte)}'`, en: `Literal '${vis(byte)}'` });
      pos = p + 1;
    },
    onDictRef: (p, index, word, length) => {
      pos = p;
      matchRange = { len: length, word };
      snapshot({
        zh: `命中字典[${index}]="${word}"（长度 ${length}）`,
        en: `Hit dict[${index}]="${word}" (length ${length})`,
      });
      pos = p + length;
    },
    onFlushLiteral: () => {
      litBuf = [];
    },
  };

  const result = brotliDictCompress(input, DICTIONARY, 3, hooks);
  emitted.push(...result.tokens);
  pos = data.length;

  rec
    .begin({
      zh: `完成：${result.tokens.length} 个 token`,
      en: `Done: ${result.tokens.length} tokens`,
    })
    .setMap([
      { key: '输入 / input', value: input, role: 'default' as BarRole },
      {
        key: 'tokens',
        value: result.tokens
          .map((t) =>
            t.kind === 'lit' ? `lit(${t.bytes.length})` : `dict[${t.index}]*${t.length}`,
          )
          .join(' '),
        role: 'final' as BarRole,
      },
    ])
    .commit();

  return rec.build();
}
