// =============================================================================
// LZO 风格压缩 · 录制帧序列
// setArray 展示字节流（窗口/当前/match 区），setAux 展示 literal 累积与已输出 token。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lzoCompress, toBytes, type LzoHooks, type LzoToken } from './impl.ts';

export const DEFAULT_INPUT = 'ABCABCABCABCDXYZ';

function vis(c: number): string {
  if (c < 32 || c > 126) return `·${c}`;
  return String.fromCharCode(c);
}

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const data = toBytes(input);
  const windowSize = 8;
  const emitted: LzoToken[] = [];
  let pos = 0;
  let litBuf: number[] = [];
  let matchRange: { dist: number; len: number } | null = null;

  const snapshot = (note: { zh: string; en: string }): void => {
    const winStart = Math.max(0, pos - windowSize);
    const roles: BarRole[] = data.map((_, i) => {
      if (i < winStart) return 'final';
      if (i < pos) return 'sorted';
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
          label: '已输出 token',
          value: emitted.length
            ? emitted
                .map((t) =>
                  t.kind === 'lit' ? `lit(${t.bytes.length})` : `M(${t.distance},${t.length})`,
                )
                .join(' ')
            : '∅',
          role: 'final' as BarRole,
        },
      ])
      .commit();
    matchRange = null;
  };

  snapshot({ zh: `输入「${input}」`, en: `Input "${input}"` });

  const hooks: LzoHooks = {
    onLiteral: () => {
      // literal 在 flush 时统一更新显示
    },
    onMatch: (_p, dist, len) => {
      matchRange = { dist, len };
      snapshot({ zh: `匹配：dist=${dist}, len=${len}`, en: `Match: dist=${dist}, len=${len}` });
    },
    onFlushLiteral: (_start, bytes) => {
      litBuf = [];
      snapshot({
        zh: `flush ${bytes.length} 字节 literal`,
        en: `Flush ${bytes.length} literal bytes`,
      });
    },
  };

  // 重写：在每次 onLiteral 时增量更新 litBuf，方便演示
  const wrappedHooks: LzoHooks = {
    onLiteral: (_p, byte) => {
      litBuf.push(byte);
      pos = _p;
      snapshot({ zh: `literal 字节 '${vis(byte)}'`, en: `Literal byte '${vis(byte)}'` });
      pos = _p + 1;
    },
    onMatch: (p, dist, len) => {
      matchRange = { dist, len };
      pos = p;
      snapshot({ zh: `匹配：dist=${dist}, len=${len}`, en: `Match: dist=${dist}, len=${len}` });
      pos = p + len;
    },
    onFlushLiteral: hooks.onFlushLiteral,
  };

  const result = lzoCompress(input, windowSize, 3, 18, wrappedHooks);
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
            t.kind === 'lit' ? `lit(${t.bytes.length})` : `M(${t.distance},${t.length})`,
          )
          .join(' '),
        role: 'final' as BarRole,
      },
    ])
    .commit();

  return rec.build();
}
